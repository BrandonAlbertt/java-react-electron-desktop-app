# Documentación: ModalFavoritos

## 📚 ¿Qué es ModalFavoritos?

Es una **ventana emergente** (pop-up) que aparece cuando quieres agregar una canción a tus listas de reproducción. Es como un "gestor de música" donde decides en cuáles de tus listas guardar una canción.

### ¿Cómo se ve?

```
┌──────────────────────────────────────────────────┐
│  🎵 Gestor de música                         [X] │
│  Bohemian Rhapsody - Queen                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  [COLUMNA IZQUIERDA]    [COLUMNA DERECHA]       │
│  ✓ Mis Favoritas        Crear una lista nueva   │
│  ☐ Para correr          Nombre: [............]  │
│  ☐ Relajante            [Crear]                 │
│  ☐ Energía              [Cancelar]              │
│  ✓ Trabajo              [Guardar cambios]       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎯 ¿Para qué sirve?

Cuando encuentras una canción que te gusta, puedes:

1. ✅ **Agregarla a tus listas** → Marca las listas donde quieres guardarla
2. ❌ **Quitarla de listas** → Desmarca para removerla
3. ➕ **Crear una lista nueva** → Si no tienes la lista que necesitas
4. 🗑️ **Eliminar listas** → Si ya no quieres una lista
5. 💾 **Guardar cambios** → Confirma todo lo que hiciste

---

## 🔄 Flujo completo: Cómo abre y cierra

### 1️⃣ Abre el Modal

```
Usuario hace clic en "+" o "X" de una canción
         ↓
Se ejecuta: handleAbrirModalFavoritos(cancion)
         ↓
Home actualiza:
- selectedSong = la canción
- modalType = "addMusicList"
- modalFavoritosKey = modalFavoritosKey + 1
         ↓
┌─────────────────────────────────────┐
│ ModalFavoritos se abre              │
│ Carga todas tus listas              │
│ Muestra cuales ya tienen la canción │
└─────────────────────────────────────┘
```

### 2️⃣ El Modal hace cambios (SIN guardar)

```
Usuario marca/desmarca listas
         ↓
Estado local del Modal se actualiza:
- listasSeleccionadasIds = [1, 3, 5]
         ↓
NOTA: El backend NO se actualiza todavía
(los cambios quedan solo en la ventana)
         ↓
Botón "Guardar cambios" se activa
┌─────────────────────────────────────┐
│ [Guardar cambios] ← Azul (activo)   │
└─────────────────────────────────────┘
```

### 3️⃣ Guarda los cambios (Envía al servidor)

```
Usuario hizo cambios → click en "Guardar cambios"
         ↓
Modal compara:
- Estado original (cómo estaban al abrir)
- Estado actual (lo que cambió)
         ↓
Modal calcula:
- listasAgregar = listas nuevas donde agregar la canción
- listasQuitar = listas donde remover la canción
         ↓
Se envían al backend:
await agregarCancion(listaId, cancionId);  // Para cada lista a agregar
await quitarCancion(listaId, cancionId);   // Para cada lista a quitar
         ↓
Home recarga biblioteca:
await recargarBiblioteca();
         ↓
┌─────────────────────────────────────┐
│ ModalFavoritos se cierra            │
│ Tus listas ahora tienen los cambios │
└─────────────────────────────────────┘
```

### 4️⃣ Cierra el Modal

```
Usuario hace clic en [X] o "Cancelar"
         ↓
Home ejecuta: handleCerrarModal()
         ↓
Home limpia:
- modalType = null
- selectedSong = null
         ↓
┌─────────────────────────────────────┐
│ ModalFavoritos desaparece           │
│ Todos los cambios se guardan        │
│ (si hizo clic en "Guardar cambios") │
└─────────────────────────────────────┘
```

---

## 📦 Props que recibe ModalFavoritos

Cuando Home abre el modal, le envía esta información:

```jsx
<ModalFavoritos
    isOpen={modalType === "addMusicList"}
    onClose={handleCerrarModal}
    listas={listas}                                // Todas tus listas
    selectedSong={selectedSong}                    // La canción actual
    onGuardarCambios={handleGuardarCambiosFavoritos}  // Función de guardar
    onCrearLista={handleCrearListaFavoritos}       // Función de crear lista
    onEliminarLista={handleEliminarListaFavoritos} // Función de eliminar lista
    key={modalFavoritosKey}                        // Reinicia el componente
/>
```

### Explicación de cada prop

| Prop | ¿Qué es? | Ejemplo |
|------|----------|---------|
| `isOpen` | ¿Está abierto el modal? | `true` o `false` |
| `onClose` | Función para cerrar | Función que cierra |
| `listas` | Todas tus listas | `[{ id: 1, nombre: "Favoritas" }, ...]` |
| `selectedSong` | La canción a gestionar | `{ id: 123, titulo: "Bohemian" }` |
| `onGuardarCambios` | Función que guarda en el servidor | Envía al backend |
| `onCrearLista` | Función para crear lista nueva | Crea y agrega |
| `onEliminarLista` | Función para borrar lista | Elimina |
| `key` | Reinicia el modal cada vez | Número que cambia |

---

## 🎨 Estados internos del Modal

Dentro del ModalFavoritos hay varios estados que controlan su comportamiento:

### Estado 1: `listasSeleccionadasIds`
**¿Qué es?** Una lista con los IDs de las listas marcadas.

```javascript
// Ejemplo
listasSeleccionadasIds = [1, 3, 5]

// Significa:
// ✓ Lista 1 (Mis Favoritas) - SELECCIONADA
// ☐ Lista 2 (Para correr) - NO SELECCIONADA  
// ✓ Lista 3 (Relajante) - SELECCIONADA
// ☐ Lista 4 (Energía) - NO SELECCIONADA
// ✓ Lista 5 (Trabajo) - SELECCIONADA
```

Cuando el usuario hace clic en una lista, este array se actualiza.

### Estado 2: `seleccionOriginalIds`
**¿Qué es?** Guarda cómo estaban las listas al abrir el modal.

```javascript
// Al abrir el modal (estado original):
seleccionOriginalIds = [1, 3]

// Usuario hace cambios:
listasSeleccionadasIds = [1, 3, 5]

// Modal compara:
// - Listas a AGREGAR = [5] (está en actual pero no en original)
// - Listas a QUITAR = [] (ninguna fue desmarcada)
```

### Estado 3: `hayCambios`
**¿Qué es?** Un boolean que dice si cambió algo.

```javascript
// Al abrir: hayCambios = false (sin cambios)
// Usuario marca una lista: hayCambios = true (¡hay cambios!)
// Usuario desmarca: hayCambios = true (¡sigue habiendo cambios!)

// Esto activa el botón "Guardar cambios"
{hayCambios && <button>Guardar cambios</button>}
```

### Estado 4: `nombreNuevaLista`
**¿Qué es?** El nombre que escribes para crear una lista nueva.

```javascript
// Usuario escribe en el input:
nombreNuevaLista = "Mi playlist de rock"

// Cuando haces clic en "Crear":
await onCrearLista(nombreNuevaLista, selectedSong)
```

### Estado 5: `isWorking`
**¿Qué es?** Indica si está procesando (comunicándose con el servidor).

```javascript
isWorking = false  // Listo para interactuar

// Usuario hizo clic en "Guardar cambios"
isWorking = true   // Enviando al servidor... espera

// Servidor respondió
isWorking = false  // Listo de nuevo
```

### Estado 6: `errorAccion`
**¿Qué es?** Mensaje de error si algo salió mal.

```javascript
errorAccion = null  // Sin problemas

// Algo falló:
errorAccion = "No se pudieron guardar los cambios."

// Se muestra al usuario
{errorAccion && <p className="text-red">{errorAccion}</p>}
```

---

## 🔧 Funciones principales del Modal

### Función 1: `handleToggleLista(listaId)`

**¿Qué hace?** Marca o desmarca una lista.

```javascript
const handleToggleLista = (listaId) => {
    // Si la lista ya está marcada
    if (listasSeleccionadasIds.includes(listaId)) {
        // Desmarcar (quitar del array)
        setListasSeleccionadasIds(prev =>
            prev.filter(id => id !== listaId)
        );
    } else {
        // Si no está marcada, marcar (agregar al array)
        setListasSeleccionadasIds(prev =>
            [...prev, listaId]
        );
    }
};
```

**Ejemplo:**
```
Usuario ve:
✓ Mis Favoritas
☐ Para correr

Usuario hizo clic en "Para correr" (desmarca):
- handleToggleLista(2) se ejecuta
- listasSeleccionadasIds pasa de [1] a [1]
- Ahora muestra:
  ✓ Mis Favoritas
  ✓ Para correr
```

### Función 2: `handleGuardarCambios()`

**¿Qué hace?** Compara el estado inicial con el actual y envía cambios al servidor.

```javascript
const handleGuardarCambios = async () => {
    // Paso 1: Validar que hay cambios
    if (!selectedSong?.id || !hayCambios) return;

    // Paso 2: Calcular diferencias
    const setOriginal = new Set(seleccionOriginalIds);
    const setActual = new Set(listasSeleccionadasIds);
    
    // ¿Qué listas SE AGREGARON?
    const listasAgregar = listasSeleccionadasIds.filter(
        id => !setOriginal.has(id)
    );
    
    // ¿Qué listas SE QUITARON?
    const listasQuitar = seleccionOriginalIds.filter(
        id => !setActual.has(id)
    );

    // Paso 3: Enviar al servidor
    await onGuardarCambios?.({
        listasAgregar,
        listasQuitar,
        song: selectedSong,
    });

    // Paso 4: Cerrar modal
    onClose?.();
};
```

**Ejemplo visual:**
```
Antes de abrir el modal:
- Canción "Bohemian Rhapsody" estaba en: [Favoritas, Trabajo]

Usuario abre modal y marca:
- Favoritas: ✓
- Para correr: ✓ (NUEVA)
- Trabajo: ✓
- Relajante: ✓ (NUEVA)

Modal calcula:
- listasAgregar = [Para correr, Relajante]  ← Agregar la canción aquí
- listasQuitar = []                          ← No quitar de ninguna

Modal envía al backend:
await agregarCancion(paraCorrer_id, bohemian_id);
await agregarCancion(relajante_id, bohemian_id);

Resultado:
- Bohemian Rhapsody está en 4 listas ahora
```

### Función 3: `handleCrearNuevaLista()`

**¿Qué hace?** Crea una lista nueva y la agrega a tu biblioteca.

```javascript
const handleCrearNuevaLista = async () => {
    // Paso 1: Obtener el nombre
    const nombre = nombreNuevaLista.trim();
    if (!nombre) return; // Validar que no esté vacío

    // Paso 2: Enviar a Home para crear
    await onCrearLista?.(nombre, selectedSong);
    
    // Paso 3: Limpiar el input
    setNombreNuevaLista("");
};
```

**Ejemplo:**
```
Usuario escribe: "Mi playlist de rock"
Usuario hace clic en [Crear]
         ↓
Modal envía a Home:
handleCrearListaFavoritos("Mi playlist de rock", selectedSong)
         ↓
Home crea la lista en el servidor:
await crearLista(usuarioId, "Mi playlist de rock", urlImagen)
         ↓
La nueva lista aparece en la columna izquierda del modal
Input se vacía: nombreNuevaLista = ""
```

### Función 4: `handleEliminarLista(listaId)`

**¿Qué hace?** Borra una lista de tu biblioteca.

```javascript
const handleEliminarLista = async (listaId) => {
    // Paso 1: Eliminar en el servidor
    await onEliminarLista?.(listaId);
    
    // Paso 2: Actualizar estado original (quitar de la selección)
    setSeleccionOriginalIds(prev =>
        prev.filter(id => id !== listaId)
    );
    
    // Paso 3: Actualizar estado actual (quitar de la selección)
    setListasSeleccionadasIds(prev =>
        prev.filter(id => id !== listaId)
    );
};
```

**Ejemplo:**
```
Usuario ve el botón [🗑️] en "Para correr"
Usuario hace clic
         ↓
Modal elimina la lista del servidor
         ↓
La lista desaparece de la columna izquierda
         ↓
Si estaba marcada, se desmarca automáticamente
```

---

## 🪝 Hooks que usa ModalFavoritos

ModalFavoritos no usa hooks de React. Usa **`useState`** de forma interna, pero **recibe funciones desde Home**.

Sin embargo, **Home sí usa hooks** para proporcionar las funciones:

### Hooks en Home que alimentan ModalFavoritos

```javascript
// Hook 1: useBiblioteca
const { listas, recargarBiblioteca } = useBiblioteca(usuarioId);
// - Trae tus listas
// - Proporciona función para refrescar

// Hook 2: useListas
const { agregarCancion, quitarCancion } = useListas();
// - agregarCancion() → Agrega canción a una lista
// - quitarCancion() → Quita canción de una lista

// Hook 3: useState
const [selectedSong, setSelectedSong] = useState(null);
const [modalType, setModalType] = useState(null);
const [modalFavoritosKey, setModalFavoritosKey] = useState(0);
```

---

## 📊 Flujo completo de datos

```
┌──────────────────────────────────────────────────────────┐
│                      HOME.jsx                            │
│                 (Componente Padre)                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Hooks:                                                   │
│ ├─ useBiblioteca()    → listas, recargarBiblioteca      │
│ ├─ useListas()        → agregarCancion, quitarCancion   │
│ ├─ useState           → selectedSong, modalType, etc    │
│                                                          │
│ Funciones:                                               │
│ ├─ handleAbrirModalFavoritos(song)                      │
│ ├─ handleGuardarCambiosFavoritos()                      │
│ ├─ handleCrearListaFavoritos()                          │
│ ├─ handleEliminarListaFavoritos()                       │
│ ├─ handleCerrarModal()                                  │
│                                                          │
└────────────────────────────────────────────────────────────┘
              ↓ Pasa props + funciones
         ┌────────────────────┐
         │  ModalFavoritos    │
         │  (Modal Pop-up)    │
         ├────────────────────┤
         │ Recibe:            │
         │ - isOpen: true     │
         │ - listas: [...]    │
         │ - selectedSong     │
         │ - onGuardarCambios │
         │ - onCrearLista     │
         │ - onEliminarLista  │
         │ - onClose          │
         │                    │
         │ Estados locales:   │
         │ - selectedIds      │
         │ - originalIds      │
         │ - hayCambios       │
         │ - nombreNuevaLista │
         │ - isWorking        │
         │ - errorAccion      │
         └────────────────────┘
              ↓ Usuario interactúa
         ┌────────────────────┐
         │ ¿Qué puede hacer?  │
         ├────────────────────┤
         │ 1. Marcar/desmarcar│
         │ 2. Crear lista     │
         │ 3. Eliminar lista  │
         │ 4. Guardar cambios │
         │ 5. Cerrar          │
         └────────────────────┘
              ↓ Usuario guarda
         Funciones de Home se ejecutan:
         - agregarCancion()
         - quitarCancion()
         - recargarBiblioteca()
              ↓
         Servidor actualiza
              ↓
         Home recarga datos
              ↓
         Modal se cierra
              ↓
    Pantalla se actualiza ✓
```

---

## 🔁 Cómo reutilizar esta lógica

Si quieres hacer algo similar en otra parte de tu app, sigue este patrón:

### Paso 1: Crear un modal con estructura similar

```jsx
export default function MiModalPersonalizado({
    isOpen,
    onClose,
    datos,              // Los elementos a gestionar
    seleccionada,       // El elemento actual
    onGuardar,          // Función para guardar
    onCrear,            // Función para crear nuevo
    onEliminar,         // Función para eliminar
}) {
    // Estados locales
    const [idsSeleccionados, setIdsSeleccionados] = useState([]);
    const [idsOriginales, setIdsOriginales] = useState([]);
    const [hayCambios, setHayCambios] = useState(false);
    
    // Funciones
    const handleToggle = (id) => { /* ... */ };
    const handleGuardar = () => { /* ... */ };
    
    return <div>{/* contenido */}</div>;
}
```

### Paso 2: Gestionar estados en el padre (Home)

```javascript
// En tu componente padre
const [modalAbierto, setModalAbierto] = useState(false);
const [elementoSeleccionado, setElementoSeleccionado] = useState(null);

const handleAbrirModal = (elemento) => {
    setElementoSeleccionado(elemento);
    setModalAbierto(true);
};

const handleCerrarModal = () => {
    setModalAbierto(false);
    setElementoSeleccionado(null);
};
```

### Paso 3: Crear funciones de guardar

```javascript
const handleGuardarCambios = async ({ idsAgregar, idsQuitar }) => {
    // Ejecutar promesas en paralelo
    await Promise.all([
        ...idsAgregar.map(id => tuFuncionAgregar(id)),
        ...idsQuitar.map(id => tuFuncionQuitar(id)),
    ]);
    
    // Recargar datos
    await tuFuncionRecargar();
    
    // Cerrar modal
    handleCerrarModal();
};
```

### Paso 4: Renderizar el modal

```jsx
<MiModalPersonalizado
    isOpen={modalAbierto}
    onClose={handleCerrarModal}
    datos={misElementos}
    seleccionada={elementoSeleccionado}
    onGuardar={handleGuardarCambios}
    onCrear={handleCrearElemento}
    onEliminar={handleEliminarElemento}
/>
```

---

## 🎯 Funciones de Home que alimentan ModalFavoritos

### Función: `handleGuardarCambiosFavoritos`

```javascript
const handleGuardarCambiosFavoritos = async ({
    listasAgregar = [],
    listasQuitar = [],
    song,
}) => {
    if (!song?.id) return null;

    // Enviar cambios al servidor en PARALELO
    // (todas a la vez, no una por una)
    await Promise.all([
        // AGREGAR canción a cada lista
        ...listasAgregar.map(listaId =>
            agregarCancion(listaId, song.id)
        ),
        // QUITAR canción de cada lista
        ...listasQuitar.map(listaId =>
            quitarCancion(listaId, song.id)
        ),
    ]);

    // Refrescar biblioteca para ver cambios
    await recargarBiblioteca?.();
    return true;
};
```

**Explicación paso a paso:**

1. **Recibe cambios del modal:**
   ```
   {
       listasAgregar: [2, 5],      // Agregar a listas 2 y 5
       listasQuitar: [3],          // Quitar de lista 3
       song: { id: 123, ... }      // Canción actual
   }
   ```

2. **Valida que existe la canción:**
   ```javascript
   if (!song?.id) return null;  // Si no hay canción, salir
   ```

3. **Crea array de promesas:**
   ```javascript
   // Para cada lista a AGREGAR:
   agregarCancion(2, 123);  // Promesa 1
   agregarCancion(5, 123);  // Promesa 2
   
   // Para cada lista a QUITAR:
   quitarCancion(3, 123);   // Promesa 3
   ```

4. **Espera a que se completen TODAS:**
   ```javascript
   await Promise.all([...promesas]);
   ```

5. **Refrescar datos:**
   ```javascript
   await recargarBiblioteca?.();
   ```

### Función: `handleCrearListaFavoritos`

```javascript
const handleCrearListaFavoritos = async (nombreLista, song) => {
    // Paso 1: Validar nombre
    const nombre = nombreLista?.trim();
    if (!usuarioId || !nombre) return null;

    // Paso 2: Obtener imagen de la canción
    const urlImagen =
        song?.imagen_grupo ||
        song?.imagen ||
        song?.imagen_url ||
        song?.groupImage ||
        null;

    // Paso 3: Crear lista en servidor
    const data = await crearLista(usuarioId, nombre, urlImagen);
    const listaCreada = data?.lista || data;

    // Paso 4: Agregar la lista a tu estado local
    if (listaCreada?.id) {
        setListas(prev => [
            ...prev,
            {
                ...listaCreada,
                imagen: listaCreada.imagen || urlImagen,
                canciones: listaCreada.canciones || [],
            },
        ]);
    }

    return data;
};
```

**Lo que hace:**
- ✓ Valida el nombre
- ✓ Obtiene la imagen de la canción
- ✓ Crea la lista en el servidor
- ✓ Agrega la nueva lista al estado local
- ✓ Actualiza la interfaz automáticamente

### Función: `handleEliminarListaFavoritos`

```javascript
const handleEliminarListaFavoritos = async (listaId) => {
    if (!listaId) return null;

    // Paso 1: Eliminar en servidor
    const data = await borrarLista(listaId);
    
    // Paso 2: Remover de tu lista local
    setListas(prev => prev.filter(lista => lista.id !== listaId));

    // Paso 3: Si esa era la lista seleccionada, deseleccionar
    if (listaSeleccionadaId === listaId) {
        setListaSeleccionadaId(null);
    }

    return data;
};
```

---

## 💡 Conceptos clave explicados

### ¿Qué es `Promise.all()`?

Es cuando quieres hacer múltiples tareas a la vez y esperar a que TODAS terminen.

```javascript
// Ejemplo: Tienes 3 amigos en cafeterías diferentes
// Pides un café a cada uno:

// FORMA LENTA (uno por uno):
const cafe1 = await pedirCafe(amigo1);  // Espera
const cafe2 = await pedirCafe(amigo2);  // Espera más
const cafe3 = await pedirCafe(amigo3);  // Espera aún más
// Total: 30 minutos

// FORMA RÁPIDA (todos a la vez):
const todos = await Promise.all([
    pedirCafe(amigo1),
    pedirCafe(amigo2),
    pedirCafe(amigo3),
]);
// Total: 10 minutos

// El ModalFavoritos usa esto para ahorrar tiempo
```

### ¿Qué es `trim()`?

Elimina espacios al inicio y final de un texto.

```javascript
"  Mi lista  ".trim();  // "Mi lista"
"".trim();              // ""
```

### ¿Qué es `filter()`?

Crea un nuevo array quitando elementos que no cumplen la condición.

```javascript
// Tienes lista: [1, 2, 3, 4, 5]
// Quieres quitar el 3:

[1, 2, 3, 4, 5].filter(id => id !== 3);
// Resultado: [1, 2, 4, 5]

// ModalFavoritos usa esto para desmarcar listas
```

---

## 📝 Resumen visual

```
┌─────────────────────────────────────────┐
│     FLUJO COMPLETO DEL MODALFAVORITOS   │
├─────────────────────────────────────────┤
│                                         │
│  1. ABRIR                               │
│     Usuario hace clic en + o X          │
│     ↓                                   │
│  2. CARGAR                              │
│     Modal carga tus listas              │
│     Marca las que ya tienen la canción  │
│     ↓                                   │
│  3. EDITAR (sin guardar)                │
│     Usuario marca/desmarca              │
│     Cambios solo en la ventana          │
│     ↓                                   │
│  4. GUARDAR                             │
│     Usuario hace clic en "Guardar"      │
│     Se comparan cambios                 │
│     Se envía al servidor                │
│     ↓                                   │
│  5. CERRAR                              │
│     Modal cierra                        │
│     Listas actualizadas                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎁 Extra: Pequeños tips

### Tip 1: `key` en React
La prop `key={modalFavoritosKey}` reinicia el componente cada vez que abre.

```javascript
// Sin key:
- Abres modal
- Cierras modal
- Abres de nuevo
- Los estados internos podrían estar "sucios"

// Con key:
- Cada vez que key cambia, React crea un componente NUEVO
- Todos los estados vuelven a su valor inicial
- Todo está "limpio"
```

### Tip 2: Orden de operaciones
```javascript
// ✅ CORRECTO
1. Compara cambios
2. Valida datos
3. Envía al servidor
4. Refrescar
5. Cierra modal

// ❌ INCORRECTO
1. Cierra modal
2. Envía al servidor ← Ya es tarde, usuario ve que cerró
```

### Tip 3: `async/await`
```javascript
// Cuando usas await, esperas a que termine
await agregarCancion(listaId, cancionId);  // Espera hasta terminar
console.log("Listo!");

// Sin await:
agregarCancion(listaId, cancionId);  // NO espera
console.log("Listo!");  // ← Imprime antes de terminar
```

---

## 📞 Preguntas frecuentes

### P: ¿Por qué el modal tiene dos arrays (original y actual)?
**R:** Para saber qué cambió exactamente. Sin el original, no sabrías si un lista debe agregarse o quitarse.

### P: ¿Qué pasa si cierro el modal sin guardar?
**R:** Nada. Los cambios se pierden porque solo estaban en la ventana. El servidor no se afectó.

### P: ¿Puedo crear una lista con una canción dentro?
**R:** Sí. Cuando creates una lista desde el modal, la canción actual se agrega automáticamente a la nueva lista.

### P: ¿Qué pasa si hay error al guardar?
**R:** Se muestra `errorAccion` en pantalla. Los botones se vuelven a activar para que reintentar.

### P: ¿Debo usar `Promise.all()` o uno por uno?
**R:** Usa `Promise.all()`. Es más rápido y profesional. Uno por uno es lento.

---

**Última actualización:** 2026
**Autor:** Sistema de Documentación
**Versión:** 1.0
