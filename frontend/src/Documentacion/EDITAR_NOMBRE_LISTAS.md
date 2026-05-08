# Documentacion tecnica: ModalPlaylist, edicion de listas y panel administrador

Este documento explica como funciona el modal `ModalPlaylist`, como se edita el nombre de una lista, como viaja la informacion entre componentes, y que hace la vista de administrador.

La version actual ya no renderiza toda la vista de usuario directamente dentro de `ModalPlaylist.jsx`. Ahora el modal actua como contenedor y coordinador, mientras que la pantalla de edicion de listas vive en `EditListas.jsx`.

Archivos principales:

- `frontend/src/components/modals/ModalPlaylist.jsx`
- `frontend/src/components/modals/contents/favoritos/EditListas.jsx`
- `frontend/src/components/modals/contents/favoritos/FavoritosList.jsx`
- `frontend/src/components/modals/contents/favoritos/FavoritosListItem.jsx`
- `frontend/src/components/modals/contents/gestion/gestionGrupoandMusica.jsx`
- `frontend/src/components/modals/contents/gestion/RegistrarGrupoForm.jsx`
- `frontend/src/components/modals/contents/gestion/RegistrarMusicaForm.jsx`
- `frontend/src/components/modals/contents/gestion/SelectGrupoBox.jsx`
- `frontend/src/components/modals/contents/gestion/UploadBox.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/hooks/useListas.js`
- `frontend/src/api/listasApi.js`

---

## 1. Resumen rapido

`ModalPlaylist` tiene dos pestanas:

| Pestana | Componente que renderiza | Responsabilidad |
|---|---|---|
| `usuario` | `EditListas` | Seleccionar una playlist y editar su nombre. |
| `administrador` | `GestionGrupoAndMusica` | Mostrar formularios visuales para registrar grupo y musica. |

Flujo principal para renombrar:

```txt
Usuario abre ModalPlaylist
        |
        v
ModalPlaylist recibe listas desde Home
        |
        v
Usuario selecciona una lista en FavoritosList
        |
        v
FavoritosList llama onSeleccionarLista(listaId)
        |
        v
EditListas llama onSeleccionar(listaId)
        |
        v
ModalPlaylist.handleSeleccionarLista(listaId)
        |
        v
ModalPlaylist guarda listasSeleccionadasIds = [listaId]
        |
        v
ModalPlaylist calcula listaSeleccionada y sincroniza nombreLista
        |
        v
EditListas muestra la lista seleccionada y el input
        |
        v
Usuario cambia el texto y hace click en "Guardar cambios"
        |
        v
EditListas llama onGuardar()
        |
        v
ModalPlaylist.handleGuardarCambios()
        |
        v
onRenombrarLista(listaId, nuevoNombre)
        |
        v
Home.handleRenombrarListaFavoritos(listaId, nuevoNombre)
        |
        v
useListas.actualizarNombreLista(listaId, nuevoNombre)
        |
        v
listasApi.renombrarLista(listaId, nuevoNombre)
        |
        v
PUT /api/listas/:listaId
body: { nuevoNombre }
        |
        v
Home actualiza setListas(...)
        |
        v
ModalPlaylist recibe listas actualizadas
        |
        v
EditListas se renderiza con el nuevo nombre
```

---

## 2. Responsabilidad de ModalPlaylist

`ModalPlaylist.jsx` es el componente coordinador del modal. Sus tareas son:

1. Mostrar u ocultar el modal segun `isOpen`.
2. Mantener la pestana activa: `usuario` o `administrador`.
3. Mantener la lista seleccionada.
4. Mantener el texto editable del nombre.
5. Validar si se puede guardar.
6. Llamar al callback `onRenombrarLista`.
7. Renderizar la vista correcta segun la pestana activa.

Props que recibe:

```jsx
export default function ModalPlaylist({
    isOpen = false,
    onClose,
    listas = [],
    onRenombrarLista,
    onEliminarLista,
})
```

| Prop | Quien la envia | Para que sirve |
|---|---|---|
| `isOpen` | `Home.jsx` | Controla si el modal se monta o retorna `null`. |
| `onClose` | `Home.jsx` | Cierra el modal. |
| `listas` | `Home.jsx` / `useBiblioteca` | Fuente de verdad visible para las playlists. |
| `onRenombrarLista` | `Home.jsx` | Callback que conecta el modal con el backend y con `setListas`. |
| `onEliminarLista` | `Home.jsx` | Callback para eliminar una lista desde la vista de favoritos. |

Importante:

```txt
ModalPlaylist no llama directamente a axios.
ModalPlaylist no conoce listasApi.
ModalPlaylist solo emite eventos hacia Home por callbacks.
```

---

## 3. Estados internos de ModalPlaylist

Estados actuales:

```jsx
const [tabActiva, setTabActiva] = useState("usuario");
const [listasSeleccionadasIds, setListasSeleccionadasIds] = useState([]);
const [nombreLista, setNombreLista] = useState("");
const [isWorking, setIsWorking] = useState(false);
```

| Estado | Ejemplo | Uso |
|---|---|---|
| `tabActiva` | `"usuario"` | Decide si se muestra `EditListas` o `GestionGrupoAndMusica`. |
| `listasSeleccionadasIds` | `[7]` | Guarda la lista seleccionada. Aunque es array, aqui se usa solo el primer id. |
| `nombreLista` | `"Favoritas 2026"` | Valor controlado del input de renombrado. |
| `isWorking` | `true` | Bloquea interacciones mientras se guarda. |

La lista seleccionada se calcula asi:

```jsx
const listaSeleccionadaId = listasSeleccionadasIds[0] || null;

const listaSeleccionada = useMemo(() => {
    return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
}, [listas, listaSeleccionadaId]);
```

Punto clave:

```txt
ModalPlaylist guarda el id seleccionado, no una copia completa de la lista.
La lista real siempre se busca dentro del array listas que viene de Home.
```

Esto evita desincronizacion: si `Home` actualiza `listas`, el modal vuelve a calcular la lista seleccionada con los datos nuevos.

---

## 4. Render por pestanas

Dentro del `main`, el modal decide que vista montar:

```jsx
{tabActiva === "usuario" ? (
    <EditListas ... />
) : (
    <GestionGrupoAndMusica />
)}
```

La zona de contenido usa:

```jsx
<main className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto p-6 lg:p-7">
```

Por que es importante:

| Clase | Motivo |
|---|---|
| `min-h-0` | Permite que el contenido interno pueda encogerse dentro de un contenedor flex. |
| `flex-1` | Hace que el cuerpo ocupe el espacio disponible debajo del header y las pestanas. |
| `overflow-y-auto` | Permite scroll si el alto de la ventana no alcanza. |
| `no-scrollbar` | Oculta la barra visual, pero conserva el scroll. |
| `p-6 lg:p-7` | Reduce padding en ventana minima y mantiene aire en pantallas grandes. |

Esto se ajusto porque Electron define:

```js
width: 1200,
height: 800,
minWidth: 1200,
minHeight: 800,
```

En `1200x800` el alto disponible del modal es limitado, por eso el contenido debe poder adaptarse sin mostrar una barra blanca visible.

---

## 5. Vista Usuario: EditListas

`EditListas.jsx` es la vista que pinta el flujo de usuario.

Props que recibe desde `ModalPlaylist`:

```jsx
<EditListas
    listas={listas}
    onSeleccionar={handleSeleccionarLista}
    listaSeleccionadaId={listaSeleccionadaId}
    onRenombrarLista={onRenombrarLista}
    onEliminarLista={onEliminarLista}
    listasSeleccionadasIds={listasSeleccionadasIds}
    nombreLista={nombreLista}
    onNombreListaChange={setNombreLista}
    onGuardar={handleGuardarCambios}
    isWorking={isWorking}
    puedeGuardar={puedeGuardar}
/>
```

Aunque `EditListas` recibe `onRenombrarLista`, actualmente el guardado real no se dispara desde ahi. El boton usa:

```jsx
onClick={onGuardar}
```

Eso significa:

```txt
EditListas pinta el boton.
ModalPlaylist conserva la logica de guardado.
Home conserva la logica de backend y actualizacion global.
```

---

## 6. Como EditListas calcula y muestra la lista seleccionada

`EditListas` tambien calcula la lista seleccionada para poder pintar la tarjeta derecha:

```jsx
const listaSeleccionada = useMemo(() => {
    return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
}, [listas, listaSeleccionadaId]);
```

Tambien calcula la cantidad de canciones:

```jsx
const cantidadCanciones = Array.isArray(listaSeleccionada?.canciones)
    ? listaSeleccionada.canciones.length
    : Number(listaSeleccionada?.canciones || 0);
```

Si no hay lista seleccionada:

```txt
EditListas muestra un estado vacio:
"Selecciona una lista"
```

Si hay lista seleccionada:

```txt
EditListas muestra:
- imagen de la lista
- nombre actual
- cantidad de canciones
- input para cambiar el nombre
- boton Guardar cambios
```

---

## 7. Como se selecciona una lista

`EditListas` renderiza `FavoritosList`:

```jsx
<FavoritosList
    listas={listas}
    listasSeleccionadasIds={listasSeleccionadasIds}
    isWorking={isWorking}
    onSeleccionarLista={onSeleccionar}
    onEliminarLista={onEliminarLista}
/>
```

El viaje del click es:

```txt
Usuario hace click en una lista
        |
        v
FavoritosList / FavoritosListItem detecta el click
        |
        v
onSeleccionarLista(lista.id)
        |
        v
EditListas propaga onSeleccionar(lista.id)
        |
        v
ModalPlaylist.handleSeleccionarLista(listaId)
        |
        v
setListasSeleccionadasIds([listaId])
```

En `ModalPlaylist`:

```jsx
const handleSeleccionarLista = (listaId) => {
    if (isWorking) return;
    setListasSeleccionadasIds([listaId]);
};
```

La condicion `if (isWorking) return` evita cambiar de lista mientras hay una operacion de guardado en curso.

---

## 8. Sincronizacion del input

El input vive en `EditListas`, pero su estado vive en `ModalPlaylist`.

En `EditListas`:

```jsx
<input
    type="text"
    value={nombreLista}
    onChange={(e) => onNombreListaChange?.(e.target.value)}
    disabled={isWorking}
/>
```

El flujo del input es:

```txt
Usuario escribe
        |
        v
EditListas ejecuta onNombreListaChange(texto)
        |
        v
ModalPlaylist ejecuta setNombreLista(texto)
        |
        v
React renderiza de nuevo
        |
        v
EditListas recibe nombreLista actualizado por props
```

Cuando cambia la lista seleccionada, `ModalPlaylist` sincroniza el input:

```jsx
useEffect(() => {
    if (listaSeleccionada) {
        setNombreLista(listaSeleccionada.nombre || "");
    } else {
        setNombreLista("");
    }
}, [listaSeleccionada]);
```

Ejemplo:

```txt
listas = [
  { id: 1, nombre: "Rock" },
  { id: 2, nombre: "Estudio" }
]

Usuario selecciona id 2
listaSeleccionada.nombre = "Estudio"
useEffect ejecuta setNombreLista("Estudio")
EditListas recibe nombreLista = "Estudio"
input muestra "Estudio"
```

---

## 9. Validacion antes de guardar

`ModalPlaylist` calcula:

```jsx
const nombreLimpio = nombreLista.trim();

const puedeGuardar =
    !!listaSeleccionada &&
    !!nombreLimpio &&
    nombreLimpio !== listaSeleccionada.nombre &&
    !isWorking;
```

Condiciones:

| Condicion | Significado |
|---|---|
| `!!listaSeleccionada` | Hay una lista elegida. |
| `!!nombreLimpio` | El nombre no esta vacio ni es solo espacios. |
| `nombreLimpio !== listaSeleccionada.nombre` | El usuario realmente cambio el nombre. |
| `!isWorking` | No hay otra operacion de guardado en curso. |

`EditListas` solo recibe el resultado:

```jsx
disabled={!puedeGuardar}
```

Esto mantiene la regla de negocio en `ModalPlaylist`, y deja a `EditListas` como vista controlada por props.

---

## 10. Guardado del nuevo nombre

Cuando el usuario hace click en `Guardar cambios`, `EditListas` llama:

```jsx
onGuardar()
```

Ese `onGuardar` es `handleGuardarCambios` de `ModalPlaylist`:

```jsx
const handleGuardarCambios = async () => {
    if (!listaSeleccionada || isWorking) return;

    const nuevoNombre = nombreLista.trim();

    if (!nuevoNombre) return;
    if (nuevoNombre === listaSeleccionada.nombre) return;

    try {
        setIsWorking(true);
        const resultado = await onRenombrarLista?.(listaSeleccionada.id, nuevoNombre);

        if (resultado) {
            // El input se actualiza automaticamente cuando Home actualiza listas.
        }
    } catch (error) {
        console.error("Error al guardar cambios:", error);
    } finally {
        setIsWorking(false);
    }
};
```

Datos que salen de `ModalPlaylist`:

```txt
listaSeleccionada.id = 7
nuevoNombre = "Favoritas 2026"
```

Llamada:

```jsx
onRenombrarLista(7, "Favoritas 2026")
```

---

## 11. Conexion con Home

`Home.jsx` monta el modal asi:

```jsx
<ModalPlaylist
    isOpen={modalType === "gestionLista"}
    onClose={handleCerrarModal}
    listas={listas}
    onRenombrarLista={handleRenombrarListaFavoritos}
    onEliminarLista={handleEliminarListaFavoritos}
/>
```

La funcion que recibe el renombrado:

```jsx
const handleRenombrarListaFavoritos = async (listaId, nuevoNombre) => {
    const resultado = await actualizarNombreLista(listaId, nuevoNombre);

    if (resultado) {
        setListas((prev) =>
            prev.map((lista) =>
                lista.id === listaId
                    ? { ...lista, nombre: nuevoNombre }
                    : lista
            )
        );
    }

    return resultado;
};
```

Home hace dos cosas:

1. Ejecuta la accion real mediante `useListas.actualizarNombreLista`.
2. Actualiza el estado visible `listas` que viene de `useBiblioteca`.

---

## 12. Por que Home tambien llama setListas

En `Home.jsx` se usan dos hooks relacionados:

```jsx
const {
    usuario: usuarioCompleto,
    listas,
    recargarBiblioteca,
    setListas,
} = useBiblioteca(usuarioId);

const {
    crearLista,
    agregarCancion,
    quitarCancion,
    borrarLista,
    actualizarNombreLista,
} = useListas();
```

Punto importante:

```txt
La UI principal pinta listas desde useBiblioteca.
useListas ejecuta acciones y tambien tiene un estado interno, pero ese estado no es la fuente visible en Home.
```

Por eso, despues de llamar al backend, Home actualiza `setListas` de `useBiblioteca`.

Si no se hiciera:

```txt
Backend: nombre actualizado
useListas.listas: podria quedar actualizado
Home.listas: podria seguir con el nombre viejo
ModalPlaylist: seguiria recibiendo el nombre viejo por props
```

La actualizacion correcta es inmutable:

```jsx
setListas((prev) =>
    prev.map((lista) =>
        lista.id === listaId
            ? { ...lista, nombre: nuevoNombre }
            : lista
    )
);
```

No se debe mutar directamente:

```js
// Evitar:
lista.nombre = nuevoNombre;
```

---

## 13. Hook useListas

`useListas.js` concentra acciones reutilizables sobre listas:

```jsx
const {
    listas,
    setListas,
    loadingListas,
    errorListas,
    cargarListas,
    crearLista,
    agregarCancion,
    quitarCancion,
    borrarLista,
    actualizarNombreLista,
} = useListas();
```

Funcion de renombrado:

```jsx
const actualizarNombreLista = useCallback(async (listaId, nuevoNombre) => {
    try {
        setLoadingListas(true);
        setErrorListas(null);

        const data = await renombrarLista(listaId, nuevoNombre);

        setListas((prev) =>
            prev.map((lista) =>
                lista.id === listaId
                    ? { ...lista, nombre: nuevoNombre }
                    : lista
            )
        );

        return data;
    } catch (error) {
        console.error("Error al renombrar lista:", error);
        setErrorListas("No se pudo renombrar la lista.");
        return null;
    } finally {
        setLoadingListas(false);
    }
}, []);
```

Responsabilidades:

| Responsabilidad | Como lo hace |
|---|---|
| Activar loading | `setLoadingListas(true)` |
| Limpiar error anterior | `setErrorListas(null)` |
| Llamar API | `renombrarLista(listaId, nuevoNombre)` |
| Actualizar estado interno | `setListas(prev => prev.map(...))` |
| Informar exito | `return data` |
| Informar error | `return null` |
| Apagar loading | `finally` |

---

## 14. Capa API

`listasApi.js` contiene la funcion HTTP:

```jsx
export async function renombrarLista(listaId, nuevoNombre) {
    const response = await axiosClient.put(`/api/listas/${listaId}`, {
        nuevoNombre,
    });

    return response.data;
}
```

Contrato:

```txt
Metodo: PUT
URL: /api/listas/:listaId
Body:
{
  "nuevoNombre": "Favoritas 2026"
}
```

Ejemplo:

```txt
PUT /api/listas/7

{
  "nuevoNombre": "Favoritas 2026"
}
```

La capa API no conoce React, no actualiza estados y no renderiza UI.

---

## 15. Vista Administrador

La pestana `administrador` monta:

```jsx
<GestionGrupoAndMusica />
```

`GestionGrupoAndMusica.jsx` agrupa dos formularios:

```jsx
<RegistrarGrupoForm />
<RegistrarMusicaForm />
```

Layout actual:

```jsx
<div className="grid w-full grid-cols-1 gap-6 text-left lg:grid-cols-[0.72fr_1.65fr] ...">
```

Esto significa:

| Breakpoint | Layout |
|---|---|
| Menor a `lg` | Una columna: primero grupo, luego musica. |
| `lg` o mas | Dos columnas: grupo angosto y musica mas ancho. |

En la ventana minima de Electron (`1200x800`), normalmente entra en modo `lg`, por eso se ven ambas areas lado a lado.

---

## 16. RegistrarGrupoForm

`RegistrarGrupoForm.jsx` actualmente es un formulario visual. No tiene estado propio ni envia datos al backend.

Campos:

| Campo | Tipo | Estado actual |
|---|---|---|
| Nombre del grupo | `input text` | No controlado |
| Link de imagen | `input text` | No controlado |
| Subida de imagen | `UploadBox` | Solo UI |
| Boton registrar grupo | `button` | Sin handler de envio |

Estructura:

```jsx
<section>
    <input placeholder="Escribe el nombre del grupo..." />
    <input placeholder="Pega el link de la imagen..." />
    <UploadBox type="image" />
    <button>Registrar grupo</button>
</section>
```

Cuando se conecte a backend, lo recomendable es:

```txt
RegistrarGrupoForm
  estados locales
  validacion
  onSubmit
  llamada a un hook de grupos
  hook llama a api de grupos
  Home o contexto actualiza estado visible si aplica
```

---

## 17. RegistrarMusicaForm

`RegistrarMusicaForm.jsx` tambien es visual por ahora. No guarda estado ni llama API.

Campos:

| Campo | Tipo | Estado actual |
|---|---|---|
| Titulo de la cancion | `input text` | No controlado |
| Letra de la cancion | `textarea` | No controlado |
| Seleccionar grupo | `SelectGrupoBox` | Valor visual fijo |
| Link de audio | `input text` | No controlado |
| Duracion MM:SS | `input text` | No controlado |
| Subida de musica | `UploadBox` | Solo UI |
| Boton registrar musica | `button` | Sin handler de envio |

Layout interno:

```jsx
<div className="grid grid-cols-1 gap-5 md:grid-cols-[1.18fr_0.9fr]">
```

Esto divide el formulario de musica en dos columnas desde `md`:

| Columna principal | Columna secundaria |
|---|---|
| Titulo | Link de audio |
| Letra | Duracion |
| Seleccionar grupo | Upload de musica |

Este cambio evita que en la ventana minima todo se apile verticalmente y se corte.

---

## 18. SelectGrupoBox y UploadBox

`SelectGrupoBox.jsx`:

```jsx
<button className="flex h-[74px] w-full ...">
```

Responsabilidad actual:

```txt
Mostrar una opcion visual de grupo.
Todavia no abre un dropdown real ni guarda seleccion.
```

`UploadBox.jsx`:

```jsx
export default function UploadBox({ title, description, extra, type = "image" })
```

Props:

| Prop | Ejemplo | Uso |
|---|---|---|
| `title` | `"Suba la imagen"` | Titulo visible. |
| `description` | `"Haz clic o arrastra una imagen"` | Texto de ayuda. |
| `extra` | `"JPG, PNG - Max. 5MB"` | Restricciones visibles. |
| `type` | `"image"` / `"music"` | Decide si usa icono `Image` o `FileMusic`. |

Actualmente es solo presentacional:

```txt
No tiene input file.
No procesa drag and drop.
No sube archivos.
```

---

## 19. Flujo completo de datos para renombrar

```txt
Home.jsx
  listas viene de useBiblioteca(usuarioId)
  renderiza ModalPlaylist(listas, onRenombrarLista, onEliminarLista)

ModalPlaylist.jsx
  recibe listas
  guarda listasSeleccionadasIds
  calcula listaSeleccionadaId
  calcula listaSeleccionada
  guarda nombreLista
  calcula puedeGuardar
  renderiza EditListas

EditListas.jsx
  recibe listas
  recibe listaSeleccionadaId
  calcula listaSeleccionada para pintar UI
  renderiza FavoritosList
  renderiza input controlado por nombreLista
  llama onNombreListaChange cuando el usuario escribe
  llama onGuardar cuando el usuario guarda

FavoritosList.jsx / FavoritosListItem.jsx
  muestran listas
  llaman onSeleccionarLista(listaId)
  llaman onEliminarLista(listaId) si se elimina

ModalPlaylist.jsx
  handleSeleccionarLista(listaId)
    setListasSeleccionadasIds([listaId])

ModalPlaylist.jsx
  useEffect(listaSeleccionada)
    setNombreLista(listaSeleccionada.nombre)

ModalPlaylist.jsx
  handleGuardarCambios()
    nuevoNombre = nombreLista.trim()
    onRenombrarLista(listaSeleccionada.id, nuevoNombre)

Home.jsx
  handleRenombrarListaFavoritos(listaId, nuevoNombre)
    actualizarNombreLista(listaId, nuevoNombre)

useListas.js
  actualizarNombreLista(listaId, nuevoNombre)
    renombrarLista(listaId, nuevoNombre)

listasApi.js
  renombrarLista(listaId, nuevoNombre)
    PUT /api/listas/:listaId { nuevoNombre }

Backend
  actualiza el nombre
  devuelve response.data

useListas.js
  return data

Home.jsx
  if (resultado) setListas(prev => prev.map(...))
  return resultado

ModalPlaylist.jsx
  setIsWorking(false)
  recibe listas nuevas desde Home
  useEffect sincroniza nombreLista

EditListas.jsx
  muestra el nombre nuevo
```

---

## 20. Estados antes, durante y despues

Antes de seleccionar:

```txt
listasSeleccionadasIds = []
listaSeleccionadaId = null
listaSeleccionada = null
nombreLista = ""
puedeGuardar = false
```

Despues de seleccionar lista `id = 4`:

```txt
listasSeleccionadasIds = [4]
listaSeleccionadaId = 4
listaSeleccionada = { id: 4, nombre: "Mi lista" }
nombreLista = "Mi lista"
puedeGuardar = false
```

Mientras el usuario escribe:

```txt
nombreLista = "Mi lista nueva"
listaSeleccionada.nombre = "Mi lista"
puedeGuardar = true
```

Durante el guardado:

```txt
isWorking = true
input disabled
boton muestra "Guardando..."
handleSeleccionarLista no permite cambiar seleccion
```

Cuando el backend responde correctamente:

```txt
Home.setListas cambia:
{ id: 4, nombre: "Mi lista" }

por:
{ id: 4, nombre: "Mi lista nueva" }
```

Despues del render:

```txt
ModalPlaylist recibe listas actualizadas
listaSeleccionada.nombre = "Mi lista nueva"
useEffect ejecuta setNombreLista("Mi lista nueva")
puedeGuardar = false
isWorking = false
```

---

## 21. Separacion de responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `ModalPlaylist.jsx` | Contenedor del modal, tabs, estados de seleccion, validacion y guardado. |
| `EditListas.jsx` | Vista de usuario para editar listas; recibe estado y handlers por props. |
| `FavoritosList.jsx` | Lista visual de playlists. |
| `FavoritosListItem.jsx` | Item individual; dispara seleccion/eliminacion. |
| `GestionGrupoAndMusica.jsx` | Layout de administrador para grupo + musica. |
| `RegistrarGrupoForm.jsx` | Formulario visual de grupo. |
| `RegistrarMusicaForm.jsx` | Formulario visual de musica. |
| `SelectGrupoBox.jsx` | Selector visual de grupo. |
| `UploadBox.jsx` | Caja visual de subida. |
| `Home.jsx` | Orquesta callbacks, conecta modal con hooks y actualiza estado visible. |
| `useListas.js` | Acciones reutilizables, loading, errores y llamadas a API. |
| `listasApi.js` | Peticiones HTTP con `axiosClient`. |

---

## 22. Puntos a cuidar

1. `ModalPlaylist` no debe llamar directo a `listasApi`; debe usar callbacks.
2. `EditListas` debe seguir recibiendo `nombreLista`, `puedeGuardar` e `isWorking` por props.
3. Si `EditListas` se vuelve mas inteligente, evitar duplicar la logica de guardado que ya vive en `ModalPlaylist`.
4. El backend espera `{ nuevoNombre }`, no `{ nombre }`.
5. La UI visible usa `listas` de `useBiblioteca`; por eso Home debe llamar `setListas`.
6. No mutar listas directamente; usar `map` y objetos nuevos.
7. El scroll del modal se mantiene con `overflow-y-auto`, pero la barra visual se oculta con `no-scrollbar`.
8. Los formularios de administrador son visuales por ahora; no tienen `onSubmit`, estado controlado ni conexion API.
9. `UploadBox` aun no sube archivos realmente; solo muestra la UI.
10. `SelectGrupoBox` aun no abre un dropdown real; muestra un grupo fijo.

---

## 23. Version corta para recordar

```txt
Home pasa listas a ModalPlaylist
ModalPlaylist guarda seleccion y texto
ModalPlaylist renderiza EditListas en pestana usuario
EditListas muestra la UI y devuelve eventos por props
ModalPlaylist valida y llama onRenombrarLista
Home llama useListas
useListas llama listasApi
listasApi hace PUT al backend
Home actualiza setListas de useBiblioteca
ModalPlaylist recibe listas nuevas
EditListas muestra el nombre actualizado
```

En una frase:

`ModalPlaylist` coordina el estado del modal, `EditListas` pinta la edicion, `Home` conecta con la logica real, `useListas` ejecuta la accion, `listasApi` habla con el backend, y `setListas` refresca la informacion visible.
