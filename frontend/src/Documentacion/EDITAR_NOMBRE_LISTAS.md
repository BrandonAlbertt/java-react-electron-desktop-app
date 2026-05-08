# Documentacion tecnica: editar nombre de listas

Este documento explica el flujo para editar el nombre de una playlist desde el modal `ModalPlaylist`.
La idea es que puedas entender que archivo hace cada parte, como viajan los datos y como reutilizar esta logica mas adelante.

Archivos revisados:

- `frontend/src/components/modals/ModalPlaylist.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/hooks/useListas.js`
- `frontend/src/api/listasApi.js`

---

## Resumen rapido

El renombrado funciona en 4 capas:

1. `ModalPlaylist.jsx`: muestra la lista seleccionada, permite escribir el nuevo nombre y dispara el guardado.
2. `Home.jsx`: recibe el pedido del modal, llama al hook y actualiza el estado principal de `listas`.
3. `useListas.js`: contiene la funcion reutilizable `actualizarNombreLista`.
4. `listasApi.js`: envia el `PUT` al backend.

Flujo completo:

```txt
Usuario escribe nuevo nombre en ModalPlaylist
        |
        v
Click en "Guardar cambios"
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
ModalPlaylist recibe listas actualizadas por props
        |
        v
El nombre cambia en tiempo real en el modal y en el resto de la UI
```

---

## 1. Donde nace la accion

La accion nace en `ModalPlaylist.jsx`.

Importaciones principales:

```jsx
import { useEffect, useMemo, useState } from "react";
import { X, Music, Shield, User, Save, Edit3, ListMusic } from "lucide-react";
import FavoritosList from "./contents/favoritos/FavoritosList";
```

Que aporta cada import:

| Import | Para que sirve |
|---|---|
| `useState` | Guarda estados internos del modal: pestana activa, lista seleccionada, texto del input y bloqueo de guardado. |
| `useMemo` | Calcula la lista seleccionada a partir del id seleccionado y el array `listas`. |
| `useEffect` | Sincroniza el input con el nombre real de la lista seleccionada. |
| Iconos de `lucide-react` | Solo UI visual: cerrar, guardar, editar, etc. |
| `FavoritosList` | Renderiza la columna izquierda con las playlists disponibles. |

El componente recibe estas props:

```jsx
export default function ModalPlaylist({
    isOpen = false,
    onClose,
    listas = [],
    onRenombrarLista,
    onEliminarLista,
})
```

Props importantes para renombrar:

| Prop | Quien la envia | Uso |
|---|---|---|
| `isOpen` | `Home.jsx` | Decide si el modal se muestra o retorna `null`. |
| `listas` | `Home.jsx` | Array actualizado de playlists del usuario. |
| `onRenombrarLista` | `Home.jsx` | Funcion callback que conecta el modal con la actualizacion real. |
| `onClose` | `Home.jsx` | Cierra el modal. |

---

## 2. Estados internos del modal

En `ModalPlaylist.jsx`:

```jsx
const [tabActiva, setTabActiva] = useState("usuario");
const [listasSeleccionadasIds, setListasSeleccionadasIds] = useState([]);
const [nombreLista, setNombreLista] = useState("");
const [isWorking, setIsWorking] = useState(false);
```

Explicacion:

| Estado | Ejemplo | Para que sirve |
|---|---|---|
| `tabActiva` | `"usuario"` | Controla si se ve la pestana Usuario o Administrador. |
| `listasSeleccionadasIds` | `[3]` | Guarda el id de la lista seleccionada. Aunque es array, aqui se usa solo una lista. |
| `nombreLista` | `"Rock clasico"` | Guarda lo que el usuario escribe en el input. |
| `isWorking` | `true` / `false` | Bloquea botones e input mientras se guarda. Evita doble click o cambios simultaneos. |

La lista seleccionada se obtiene asi:

```jsx
const listaSeleccionadaId = listasSeleccionadasIds[0] || null;

const listaSeleccionada = useMemo(() => {
    return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
}, [listas, listaSeleccionadaId]);
```

Punto clave:

- El modal no guarda una copia completa de la lista.
- Solo guarda el id seleccionado.
- Cada render vuelve a buscar la lista actual dentro de `listas`.
- Por eso, si `Home` actualiza `listas`, el modal tambien ve el nuevo nombre.

---

## 3. Como se selecciona una lista

La seleccion ocurre desde `FavoritosList`, que recibe:

```jsx
<FavoritosList
    listas={listas}
    listasSeleccionadasIds={listasSeleccionadasIds}
    isWorking={isWorking}
    onSeleccionarLista={handleSeleccionarLista}
    onEliminarLista={onEliminarLista}
/>
```

Cuando el usuario elige una playlist:

```jsx
const handleSeleccionarLista = (listaId) => {
    if (isWorking) return;

    setListasSeleccionadasIds([listaId]);
};
```

Aqui se fuerza que haya solo una playlist seleccionada:

```txt
Antes: []
Click en lista id 5
Despues: [5]
```

Luego `listaSeleccionadaId` toma `5` y `useMemo` busca esa lista dentro de `listas`.

---

## 4. Sincronizacion del input con la lista seleccionada

El input usa el estado `nombreLista`:

```jsx
<input
    type="text"
    value={nombreLista}
    onChange={(e) => setNombreLista(e.target.value)}
    disabled={isWorking}
/>
```

Cuando cambia la lista seleccionada, se ejecuta:

```jsx
useEffect(() => {
    if (listaSeleccionada) {
        setNombreLista(listaSeleccionada.nombre || "");
    } else {
        setNombreLista("");
    }
}, [listaSeleccionada]);
```

Esto hace dos cosas:

- Si seleccionas una lista, el input se llena con el nombre actual.
- Si no hay lista seleccionada, el input queda vacio.

Ejemplo:

```txt
listas = [
  { id: 1, nombre: "Gym" },
  { id: 2, nombre: "Estudio" }
]

Usuario selecciona id 2
listaSeleccionada = { id: 2, nombre: "Estudio" }
useEffect ejecuta setNombreLista("Estudio")
input muestra "Estudio"
```

---

## 5. Validacion antes de guardar

El modal calcula si se puede guardar:

```jsx
const nombreLimpio = nombreLista.trim();

const puedeGuardar =
    !!listaSeleccionada &&
    !!nombreLimpio &&
    nombreLimpio !== listaSeleccionada.nombre &&
    !isWorking;
```

Condiciones:

| Condicion | Motivo |
|---|---|
| `!!listaSeleccionada` | Debe haber una playlist elegida. |
| `!!nombreLimpio` | No permite guardar nombres vacios o solo espacios. |
| `nombreLimpio !== listaSeleccionada.nombre` | No llama al backend si el nombre no cambio. |
| `!isWorking` | No permite guardar mientras ya hay una peticion en curso. |

El boton usa esa validacion:

```jsx
<button
    type="button"
    onClick={handleGuardarCambios}
    disabled={!puedeGuardar}
>
    {isWorking ? "Guardando..." : "Guardar cambios"}
</button>
```

---

## 6. Guardado desde el modal

En `ModalPlaylist.jsx`:

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
            // El input se actualiza automaticamente cuando Home cambia listas.
        }
    } catch (error) {
        console.error("Error al guardar cambios:", error);
    } finally {
        setIsWorking(false);
    }
};
```

Datos que salen del modal:

```txt
listaSeleccionada.id = 7
nuevoNombre = "Favoritas 2026"
```

El modal llama:

```jsx
onRenombrarLista(7, "Favoritas 2026")
```

Importante:

- `ModalPlaylist` no conoce la API.
- `ModalPlaylist` no llama directamente a `axios`.
- `ModalPlaylist` solo pide a su padre: "renombra esta lista con este nombre".

Eso permite reutilizar el modal con otra logica si algun dia cambia el backend.

---

## 7. Conexion desde Home

En `Home.jsx`, el modal se renderiza asi:

```jsx
<ModalPlaylist
    isOpen={modalType === "gestionLista"}
    onClose={handleCerrarModal}
    listas={listas}
    onRenombrarLista={handleRenombrarListaFavoritos}
    onEliminarLista={handleEliminarListaFavoritos}
/>
```

`Home` le pasa al modal:

- `listas`: el estado principal visible en la pantalla.
- `onRenombrarLista`: la funcion que sabe actualizar backend y UI.

La funcion importante:

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

Que hace paso a paso:

1. Recibe `listaId` y `nuevoNombre` desde el modal.
2. Llama a `actualizarNombreLista(listaId, nuevoNombre)`.
3. Si el hook devuelve algo correcto, actualiza el estado `listas` de `useBiblioteca`.
4. Retorna `resultado` al modal.

Ejemplo de actualizacion local:

```js
prev = [
  { id: 1, nombre: "Gym" },
  { id: 7, nombre: "Viejo nombre" }
]

listaId = 7
nuevoNombre = "Favoritas 2026"

resultado = [
  { id: 1, nombre: "Gym" },
  { id: 7, nombre: "Favoritas 2026" }
]
```

Esta parte es la que hace que la UI cambie en tiempo real sin recargar.

---

## 8. Por que Home actualiza `setListas` si `useListas` tambien tiene estado

En `Home.jsx` existen dos fuentes relacionadas:

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

- Las listas que se pintan en `TopHeader`, `PlaylistPanel`, `ExplorePanel` y `ModalPlaylist` vienen de `useBiblioteca`.
- `useListas` tiene su propio estado interno `listas`, pero en este flujo Home no usa ese array para pintar.
- Por eso, despues de llamar a `actualizarNombreLista`, Home tambien llama a `setListas`.

Si solo se actualizara el estado interno de `useListas`, el backend cambiaria, pero la pantalla podria seguir mostrando el nombre viejo porque la UI esta leyendo `listas` desde `useBiblioteca`.

Por eso existe este doble movimiento:

```txt
1. useListas actualiza backend
2. Home actualiza listas de useBiblioteca para refrescar la UI visible
```

---

## 9. Hook reutilizable: useListas

En `useListas.js` se importan las funciones API:

```jsx
import {
    agregarCancionALista,
    crearListaUsuario,
    eliminarLista,
    obtenerListasUsuario,
    quitarCancionDeLista,
    renombrarLista,
} from "../api/listasApi";
```

La funcion que renombra:

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

Responsabilidades del hook:

| Responsabilidad | Como lo hace |
|---|---|
| Activar loading | `setLoadingListas(true)` |
| Limpiar errores anteriores | `setErrorListas(null)` |
| Llamar al backend | `await renombrarLista(listaId, nuevoNombre)` |
| Actualizar su estado interno | `setListas(prev => prev.map(...))` |
| Retornar resultado | `return data` |
| Manejar error | `catch`, `setErrorListas(...)`, `return null` |
| Apagar loading | `finally`, `setLoadingListas(false)` |

Este hook es reutilizable en otros componentes porque expone:

```jsx
return {
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
};
```

Para reutilizar el renombrado en otro componente:

```jsx
const { actualizarNombreLista } = useListas();

await actualizarNombreLista(listaId, nuevoNombre);
```

Si ese componente pinta listas desde otro estado externo, tambien debe actualizar ese estado externo, igual que hace `Home`.

---

## 10. Capa API: listasApi

En `listasApi.js` se importa el cliente HTTP:

```jsx
import axiosClient from "./axiosClient";
```

La funcion de renombrado:

```jsx
export async function renombrarLista(listaId, nuevoNombre) {
    const response = await axiosClient.put(`/api/listas/${listaId}`, {
        nuevoNombre,
    });

    return response.data;
}
```

Datos enviados:

```txt
Metodo: PUT
URL: /api/listas/:listaId
Body:
{
  "nuevoNombre": "Favoritas 2026"
}
```

Ejemplo real:

```txt
listaId = 7
nuevoNombre = "Favoritas 2026"

PUT /api/listas/7
{
  "nuevoNombre": "Favoritas 2026"
}
```

Respuesta esperada segun comentario del archivo:

```js
{
  mensaje: "Lista renombrada correctamente"
}
```

La capa API no maneja estados de React. Solo hace la peticion y devuelve `response.data`.

---

## 11. Como se actualiza el modal en tiempo real

El modal se actualiza por este encadenamiento:

```txt
Home tiene listas
    |
    v
Home pasa listas a ModalPlaylist como prop
    |
    v
ModalPlaylist calcula listaSeleccionada con useMemo
    |
    v
Usuario guarda nuevo nombre
    |
    v
Home ejecuta setListas(...)
    |
    v
React renderiza Home otra vez
    |
    v
ModalPlaylist recibe listas nuevas
    |
    v
useMemo encuentra la misma lista, pero con nombre actualizado
    |
    v
useEffect sincroniza nombreLista con listaSeleccionada.nombre
    |
    v
Input, titulo de card y listas visibles muestran el nuevo nombre
```

La parte mas importante es esta:

```jsx
setListas((prev) =>
    prev.map((lista) =>
        lista.id === listaId
            ? { ...lista, nombre: nuevoNombre }
            : lista
    )
);
```

Por que funciona:

- `map` crea un array nuevo.
- Para la lista editada crea un objeto nuevo con `{ ...lista, nombre: nuevoNombre }`.
- React detecta cambio de referencia.
- Home se renderiza otra vez.
- El modal recibe props nuevas.

No se muta directamente:

```js
// Evitar este estilo:
lista.nombre = nuevoNombre;
```

Porque mutar el objeto directamente puede no disparar correctamente el render de React.

---

## 12. Flujo de datos completo con nombres de funciones

```txt
ModalPlaylist.jsx
  input.onChange
    setNombreLista(e.target.value)

ModalPlaylist.jsx
  button.onClick
    handleGuardarCambios()

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
    axiosClient.put(`/api/listas/${listaId}`, { nuevoNombre })

Backend
  actualiza la playlist
  devuelve response.data

useListas.js
  return data

Home.jsx
  if (resultado) setListas(prev => prev.map(...))
  return resultado

ModalPlaylist.jsx
  setIsWorking(false)

React
  renderiza con listas actualizadas
```

---

## 13. Estados antes, durante y despues

Antes de editar:

```txt
listas = [{ id: 4, nombre: "Mi lista" }]
listasSeleccionadasIds = [4]
listaSeleccionada.nombre = "Mi lista"
nombreLista = "Mi lista"
puedeGuardar = false
```

Mientras el usuario escribe:

```txt
nombreLista = "Mi lista nueva"
listaSeleccionada.nombre = "Mi lista"
puedeGuardar = true
```

Al hacer click en guardar:

```txt
isWorking = true
boton = "Guardando..."
input disabled
```

Cuando responde el backend:

```txt
Home.setListas cambia:
{ id: 4, nombre: "Mi lista" }
por:
{ id: 4, nombre: "Mi lista nueva" }
```

Despues del render:

```txt
listaSeleccionada.nombre = "Mi lista nueva"
nombreLista = "Mi lista nueva"
puedeGuardar = false
isWorking = false
```

---

## 14. Como reutilizar esta logica mas adelante

Si quieres renombrar una lista desde otro modal, panel o boton, necesitas tres piezas:

### Pieza 1: capturar el nuevo nombre

```jsx
const [nuevoNombre, setNuevoNombre] = useState("");
```

### Pieza 2: llamar a la accion del hook

```jsx
const { actualizarNombreLista } = useListas();

const guardarNombre = async () => {
    const nombre = nuevoNombre.trim();
    if (!nombre) return;

    const resultado = await actualizarNombreLista(listaId, nombre);

    if (resultado) {
        // actualizar el estado que tu pantalla usa para pintar listas
    }
};
```

### Pieza 3: actualizar el estado visible

Si tu pantalla usa `listas` desde `useBiblioteca`, debes hacer:

```jsx
setListas((prev) =>
    prev.map((lista) =>
        lista.id === listaId
            ? { ...lista, nombre }
            : lista
    )
);
```

Regla practica:

```txt
Actualiza siempre el mismo estado desde donde tu componente esta pintando la informacion.
```

Si el componente pinta desde `useListas().listas`, basta con el estado interno del hook.
Si pinta desde `useBiblioteca().listas`, debes actualizar `setListas` de `useBiblioteca`.

---

## 15. Separacion de responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `ModalPlaylist.jsx` | UI, seleccion de lista, input, validaciones visuales y llamada a `onRenombrarLista`. |
| `Home.jsx` | Orquesta el flujo, conecta modal con hook y mantiene actualizado el estado visible global. |
| `useListas.js` | Encapsula acciones de listas, loading, errores y llamadas a API. |
| `listasApi.js` | Hace peticiones HTTP con `axiosClient`. |

Esta separacion ayuda porque:

- El modal no depende del backend.
- El hook puede reutilizarse en otros lugares.
- La API queda centralizada.
- Home decide como refrescar la UI principal.

---

## 16. Puntos a cuidar

1. El backend espera `{ nuevoNombre }`, no `{ nombre }`.
2. `ModalPlaylist` usa solo una lista seleccionada, aunque el estado se llame `listasSeleccionadasIds`.
3. El boton no guarda si el nombre esta vacio, no cambio o hay una peticion activa.
4. Para que el cambio se vea inmediatamente, hay que actualizar el estado que alimenta la UI.
5. No mutar listas directamente; usar `map` y retornar objetos nuevos.
6. Si en el futuro el backend devuelve la lista actualizada completa, se podria usar esa respuesta en vez de confiar solo en `nuevoNombre`.

---

## 17. Version corta para recordar

```txt
ModalPlaylist captura el nombre
Home recibe listaId + nuevoNombre
useListas llama a listasApi
listasApi hace PUT al backend
Home actualiza setListas
ModalPlaylist recibe listas nuevas
useEffect sincroniza el input
```

En una frase:

`ModalPlaylist` pide el cambio, `Home` lo coordina, `useListas` lo ejecuta, `listasApi` lo envia, y `setListas` hace que la interfaz se actualice en tiempo real.
