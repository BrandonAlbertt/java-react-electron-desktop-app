# Documentación: Playlist Panel y Explore Panel

## 📚 ¿Qué son estos paneles?

Tu aplicación de música tiene dos espacios principales donde puedes escuchar canciones:

1. **Playlist Panel** → Las listas de canciones que tú creas (ej: "Mi top 10", "Canciones favoritas")
2. **Explore Panel** → Un explorador de todas las canciones disponibles, organizadas por grupos/artistas

---

## 🎵 PLAYLIST PANEL

### ¿Qué es?
Es el panel donde se muestran todas las canciones de **una lista de reproducción que seleccionaste**. Es como tener un cuaderno donde escribiste las canciones que te gustan.

### ¿Dónde aparece?
En la pantalla principal, en la columna izquierda, cuando seleccionas una lista.

### ¿Cómo funciona?

```
┌─────────────────────────────────────┐
│  [Imagen de la lista]               │
│  Nombre: "Mi playlist favorita"      │
│  Cantidad: "45 canciones"            │
└─────────────────────────────────────┘
│  ♪ Canción 1 - Artista A   [Play]   │
│  ♪ Canción 2 - Artista B   [Play]   │
│  ♪ Canción 3 - Artista C   [Play]   │
│  ... (más canciones)                │
└─────────────────────────────────────┘
```

### Props principales (Los datos que recibe)

| Prop | ¿Qué es? | Ejemplo |
|------|----------|---------|
| `lista` | La lista de canciones actual | `{ nombre: "Favoritas", canciones: [...] }` |
| `cancionActivaId` | El ID de la canción que está sonando | `"123"` |
| `isPlaying` | ¿Está sonando música ahora? | `true` o `false` |
| `origenReproduccion` | ¿De dónde vino la canción? | `"PlaylistPanel"` o `"ExplorePanel"` |
| `onSeleccionarCancion` | Función para reproducir una canción | Función que envía la canción al reproductor |
| `onAbrirModalFavoritos` | Función para abrir el modal de favoritos | Función que abre un formulario |

### ¿Cómo se REPRODUCE una canción?

**Paso 1**: Haces clic en el botón ▶️ (Play) de una canción
```jsx
<button onClick={() => onSeleccionarCancion?.(song)}>
  <Play size={16} />  // Icono de play
</button>
```

**Paso 2**: Se envía la canción hacia arriba (a Home)
```javascript
// En PlaylistPanel.jsx
const handleSeleccionarCancion = (cancion) => {
    onSeleccionarCancion?.(cancion);  // Se envía la canción
};
```

**Paso 3**: Home recibe la canción y actualiza:
- `cancionActiva` → Cuál es la canción
- `isPlaying` → true (comienza a sonar)
- `origenReproduccion` → "PlaylistPanel" (sé de dónde vino)

**Resultado**: 
- 🟢 El botón cambia de ▶️ a ⏸️
- 🎨 La canción se destaca con color purpura
- 🔊 El audio comienza a reproducirse

### ¿Cómo se PAUSA una canción?

Es lo **OPUESTO** a reproducir:

**Paso 1**: Ves que la canción está sonando (aparece ⏸️)
```jsx
{isPlaying ? (
    <Pause size={16} fill="currentColor" />  // Icono de pausa
) : (
    <Play size={16} fill="currentColor" />   // Icono de play
)}
```

**Paso 2**: Haces clic en el botón ⏸️
```jsx
<button onClick={() => onSeleccionarCancion?.(song)}>
  <Pause size={16} />
</button>
```

**Paso 3**: Se envía la misma canción de nuevo
```javascript
// Home recibe la canción otra vez
// Pero ahora isPlaying estaba true → cambia a false
```

**Resultado**:
- El botón cambia de ⏸️ a ▶️
- 🔊 La música se detiene

### Ejemplo visual

```
Usuario quiere reproducir "Bohemian Rhapsody":
┌────────────────────────────────┐
│ Bohemian Rhapsody - Queen      │
│ [▶️] ← Click aquí              │
└────────────────────────────────┘
         ↓ Se envía canción
┌────────────────────────────────┐
│ Home actualiza:                │
│ - cancionActiva = "Queen..."   │
│ - isPlaying = true             │
│ - origenReproduccion = Playlist│
└────────────────────────────────┘
         ↓ Se reproduce
🎵 ¡La música suena!
┌────────────────────────────────┐
│ Bohemian Rhapsody - Queen      │
│ [⏸️] ← Ahora muestra pausa    │
└────────────────────────────────┘

Usuario quiere pausar:
         ↓ Click en pausa
┌────────────────────────────────┐
│ Home actualiza:                │
│ - isPlaying = false            │
└────────────────────────────────┘
         ↓ Se pausa
🤐 ¡La música se detiene!
│ [▶️] ← Vuelve a mostrar play  │
└────────────────────────────────┘
```

---

## 🔍 EXPLORE PANEL

### ¿Qué es?
Es un explorador de **todas las canciones disponibles**. Es como tener una tienda de música donde puedes buscar y descubrir nuevas canciones. Está organizado por grupos/artistas.

### ¿Dónde aparece?
En la pantalla principal, en la columna central/derecha.

### ¿Cómo funciona?

```
┌─────────────────────────────────────┐
│  [🔍 Buscar canciones]              │
│  ─────────────────────────────────  │
│  📋 GRUPOS  |  🎵 CANCIONES        │ ← Dos pestañas
├─────────────────────────────────────┤
│                                     │
│  Pestaña GRUPOS:                    │
│  [🎸 The Beatles]                  │
│  [🎤 Michael Jackson]               │
│  [🎹 Queen]                        │
│  [🎺 Miles Davis]                  │
│  ...                                │
│                                     │
└─────────────────────────────────────┘
```

### Props principales

| Prop | ¿Qué es? | Ejemplo |
|------|----------|---------|
| `grupos` | Lista de todos los grupos/artistas | `[{ nombre: "Beatles" }, ...]` |
| `canciones` | Lista de todas las canciones | `[{ titulo: "Hey", grupo: "Beatles" }, ...]` |
| `cancionActivaId` | ID de la canción sonando | `"123"` |
| `isPlaying` | ¿Está sonando? | `true` o `false` |
| `origenReproduccion` | ¿De dónde salió? | `"ExplorePanel"` |
| `onSeleccionarCancion` | Función para reproducir | Envía canción + lista visible |
| `listaSeleccionada` | La lista de favoritos actual | `{ id: "1", canciones: [...] }` |

### ¿Cómo se REPRODUCE una canción?

**Paso 1**: En la pestaña de GRUPOS, haces clic en un grupo
```javascript
// ExplorePanel.jsx
const handleGroupClick = (group) => {
    setSelectedGroup(group);      // Selecciona grupo
    setActiveTab("songs");         // Cambia a pestaña canciones
    setSearch("");                 // Limpia búsqueda
};
```

**Paso 2**: Aparecen todas las canciones de ese grupo
```
Pestaña CANCIONES (después de seleccionar The Beatles):
│ ← Volver a grupos
├─────────────────────────────────────┤
│  ♪ Hey Jude - The Beatles   [Play]  │
│  ♪ Let It Be - The Beatles  [Play]  │
│  ♪ Abbey Road - The Beatles [Play]  │
│  ...                                │
└─────────────────────────────────────┘
```

**Paso 3**: Haces clic en ▶️ de cualquier canción
```jsx
<button onClick={() => onSeleccionarCancion?.(cancion, songsToShow)}>
  <Play size={16} />
</button>
```

**Paso 4**: Se envía a Home:
- La canción que seleccionaste
- TODAS las canciones visibles de ese grupo (para la cola)

```javascript
// Home recibe
const handleSeleccionarCancion = (cancion, colaVisual) => {
    setCancionActiva(cancion);
    setColaReproduccion(colaVisual);      // ← Guarda la cola
    setOrigenReproduccion("ExplorePanel");
    setIsPlaying(true);
};
```

### ¿Cómo se PAUSA una canción?

**Igual que en Playlist**, haces clic en ⏸️:

```javascript
// Si la canción estaba sonando desde ExplorePanel
// Y haces clic en el botón de pausa
// Se envía la misma canción pero isPlaying cambia a false
```

### Ejemplo visual

```
Usuario explora música:
┌──────────────────────────────────┐
│ [🔍 Buscar]                      │
│ 📋 GRUPOS  |  🎵 CANCIONES       │
├──────────────────────────────────┤
│ ← Volver                         │
│                                  │
│ The Beatles (grupo seleccionado) │
│                                  │
│ ♪ Yesterday - Beatles   [▶️]     │
│ ♪ Let It Be - Beatles   [▶️]     │
│ ♪ Help! - Beatles       [▶️]     │
└──────────────────────────────────┘

Usuario hace clic en ▶️ de "Yesterday":
         ↓
Home recibe:
- cancionActiva = "Yesterday"
- colaReproduccion = [Yesterday, Let It Be, Help!, ...]
- isPlaying = true
- origenReproduccion = "ExplorePanel"
         ↓
┌──────────────────────────────────┐
│ ♪ Yesterday - Beatles   [⏸️]     │ ← Aparece pausa
│ ♪ Let It Be - Beatles   [▶️]     │
│ ♪ Help! - Beatles       [▶️]     │
└──────────────────────────────────┘

🎵 ¡Yesterday está sonando!

Usuario hace clic en ⏸️:
         ↓
Home actualiza:
- isPlaying = false
         ↓
🤐 ¡La música se pausa!
```

---

## 🔄 FLUJO DE PROPS (¿Cómo viajan los datos?)

### De arriba hacia abajo (Home → Paneles)

```
HOME (Componente Principal)
├─ Estado: cancionActiva = "Hey Jude"
├─ Estado: isPlaying = true
├─ Estado: origenReproduccion = "ExplorePanel"
│
├──────────────────────────────────────────────────────────┐
│                                                          │
├─→ PlaylistPanel                                         │
│   ├─ Recibe: cancionActivaId = ID de "Hey Jude"       │
│   ├─ Recibe: isPlaying = true                           │
│   ├─ Recibe: origenReproduccion = "ExplorePanel"       │
│   └─ Resultado: No destaca (porque viene de Explore)  │
│                                                        │
├─→ ExplorePanel                                         │
│   ├─ Recibe: cancionActivaId = ID de "Hey Jude"       │
│   ├─ Recibe: isPlaying = true                          │
│   ├─ Recibe: origenReproduccion = "ExplorePanel" ✓    │
│   └─ Resultado: La destaca porque es suya ✓            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**En código:**

```jsx
// HOME.jsx
<PlaylistPanel
    lista={listaSeleccionada}
    cancionActivaId={cancionActiva?.id}
    isPlaying={isPlaying}
    origenReproduccion={origenReproduccion}
    onSeleccionarCancion={handleSeleccionarCancion}
/>

<ExplorePanel
    grupos={gruposFiltradosPorGenero}
    canciones={cancionesFiltradasPorGenero}
    cancionActivaId={cancionActiva?.id}
    isPlaying={isPlaying}
    origenReproduccion={origenReproduccion}
    onSeleccionarCancion={handleSeleccionarCancion}
/>
```

### De abajo hacia arriba (Paneles → Home)

```
PlaylistPanel haces clic en ▶️
         ↓
onSeleccionarCancion({
    id: "123",
    titulo: "Bohemian Rhapsody",
    grupo: "Queen"
})
         ↓
HOME actualiza estados:
- cancionActiva = canción
- isPlaying = true (o false si estaba sonando)
- origenReproduccion = "PlaylistPanel"
- colaReproduccion = lista.canciones
         ↓
Se ejecuta PlayerBar para reproducir audio
```

---

## 🪝 HOOKS UTILIZADOS

### ¿Qué es un Hook?
Un "gancho" que atrapa datos del servidor y los trae a la aplicación. Es como tener un asistente que va a buscar información.

### Hook 1: `useExplorar()`

**¿Para qué sirve?**
Trae todos los grupos, géneros y canciones disponibles del servidor.

**¿Dónde se usa?**
En Home.jsx para cargar el contenido del Explore Panel.

**¿Qué retorna?**
```javascript
{
    data: {
        generos: [...],      // "Rock", "Pop", "Jazz"
        grupos: [...],       // "The Beatles", "Queen"
        canciones: [...]     // Todas las canciones
    },
    loading: true,           // ¿Está cargando?
    error: null              // ¿Hay error?
}
```

**Ejemplo:**
```javascript
// En Home.jsx
const { data: explorarData, loading, error } = useExplorar();

// Espera a que cargue
if (loading) return <p>Cargando...</p>;

// Si hay error
if (error) return <p>Error: {error}</p>;

// Ahora tienes los datos disponibles
console.log(explorarData.canciones); // Todas las canciones
```

### Hook 2: `useListas()`

**¿Para qué sirve?**
Maneja las listas que el usuario crea (crear, agregar canciones, eliminar, etc).

**¿Dónde se usa?**
En Home.jsx para manejar las listas del usuario.

**¿Qué retorna?**
```javascript
{
    crearLista: function,      // Función para crear lista
    agregarCancion: function,  // Función para agregar canción a lista
    quitarCancion: function,   // Función para quitar canción de lista
    borrarLista: function,     // Función para eliminar lista
    listas: [],                // Array de listas del usuario
    loadingListas: false       // ¿Está cargando?
}
```

**Ejemplo:**
```javascript
// En Home.jsx
const { crearLista, agregarCancion } = useListas();

// Crear una nueva lista
await crearLista(usuarioId, "Mi lista", "url-imagen");

// Agregar una canción a una lista
await agregarCancion(listaId, cancionId);
```

### Hook 3: `useBiblioteca()`

**¿Para qué sirve?**
Trae todas las listas del usuario actual y la información de su perfil.

**¿Dónde se usa?**
En Home.jsx cuando el usuario inicia sesión.

**¿Qué retorna?**
```javascript
{
    usuario: { id, nombre, email },    // Datos del usuario
    listas: [                          // Listas del usuario
        { id: 1, nombre: "Favoritas", canciones: [...] },
        { id: 2, nombre: "Para correr", canciones: [...] }
    ],
    recargarBiblioteca: function,     // Función para refrescar
    setListas: function                // Función para actualizar listas
}
```

**Ejemplo:**
```javascript
// En Home.jsx
const { usuario, listas, recargarBiblioteca } = useBiblioteca(usuarioId);

// Mostrar listas
console.log(listas); // [{ nombre: "Favoritas" }, ...]

// Refrescar si cambió algo
await recargarBiblioteca();
```

---

## 📊 Diagrama completo del flujo

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                        HOME.jsx                          │
│  (El componente principal que coordina todo)             │
│                                                          │
│  Estados:                                               │
│  - cancionActiva                                        │
│  - isPlaying                                            │
│  - origenReproduccion                                   │
│  - colaReproduccion                                     │
│  - listaSeleccionada                                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Hooks:                                                  │
│  ├─ useExplorar() → Trae grupos, géneros, canciones    │
│  ├─ useListas()  → Maneja listas del usuario            │
│  └─ useBiblioteca() → Trae listas y perfil del usuario │
│                                                          │
└──────────────────────────────────────────────────────────┘
         │                          │
         │ Pasa props              │ Pasa props
         │ + funciones             │ + funciones
         ↓                          ↓
    ┌──────────┐             ┌─────────────┐
    │ Playlist │             │   Explore   │
    │ Panel    │             │   Panel     │
    └──────────┘             └─────────────┘
         │                          │
         │ Usuario hace clic        │ Usuario hace clic
         │ en botón play/pause      │ en botón play/pause
         │                          │
         └──────────┬───────────────┘
                    │
                    ↓
         onSeleccionarCancion()
         (Función enviada desde Home)
                    │
                    ↓
         Home actualiza sus estados:
         - cancionActiva = canción
         - isPlaying = true/false
         - origenReproduccion = "PlaylistPanel" o "ExplorePanel"
                    │
                    ↓
         Los paneles se actualizan automáticamente
         porque reciben props nuevas
                    │
                    ↓
         PlayerBar reproduce la música 🎵
```

---

## 🎯 Resumen simple

| Concepto | Explicación | Ejemplo |
|----------|------------|---------|
| **Playlist Panel** | Muestra canciones de TU lista | "Mis favoritas" con 50 canciones |
| **Explore Panel** | Muestra TODAS las canciones disponibles | Búsqueda por grupo: "Beatles" |
| **Props** | Datos que viajan de padre a hijo | Canción actual, está sonando?, etc |
| **Hook** | Función que busca datos del servidor | `useExplorar()` trae canciones |
| **Play** | Reproducir canción | Haces clic en ▶️ |
| **Pause** | Pausar canción | Haces clic en ⏸️ |
| **Cola** | Lista de canciones listas para sonar | Canciones del grupo actual |

---

## 💡 Preguntas frecuentes

### ¿Cuál es la diferencia entre Playlist y Explore?
- **Playlist**: TÚ decides qué canciones van. Es personal.
- **Explore**: Son TODAS las canciones disponibles. Para descubrir.

### ¿Cómo sé si una canción está sonando desde Playlist o Explore?
Mira el valor de `origenReproduccion`. Si dice:
- `"PlaylistPanel"` → Viene de tu lista
- `"ExplorePanel"` → Viene de explorar

### ¿Qué pasa cuando cambio de Playlist?
Home actualiza `listaSeleccionada` y PlaylistPanel recibe las nuevas canciones. Es como cambiar de cuaderno.

### ¿Puedo reproducir la misma canción desde Playlist y desde Explore?
Sí. La canción es la misma, pero el origen es diferente. `origenReproduccion` diferencia de dónde salió.

---

## 📝 Notas técnicas (Para programadores)

### Props drilling prevention
El flujo de props se mantiene simple:
- Home es el "padre" que coordina
- PlaylistPanel y ExplorePanel son "hijos" que reciben props
- Los "nietos" (SongItem, ExploreSongItem) reciben lo necesario

### State management
- `cancionActiva`: Qué canción está seleccionada
- `isPlaying`: Boolean que indica reproducción
- `origenReproduccion`: String que identifica el origen
- `colaReproduccion`: Array de canciones en orden

### Normalization
`normalizeSong()` convierte canciones del API al formato interno de la app.

### Performance
- `useMemo()` evita recalcular listas cada render
- Referencias con `useRef()` para scroll suave
- Scroll lazy para listas largas

---

**Última actualización:** 2026
**Autor:** Sistema de Documentación
**Versión:** 1.0
