# Mapeo de Props y Handlers: Home → Hijos

Tabla de rastreabilidad completa que muestra dónde se define cada prop/handler en Home y a qué componente hijo llega.

---

## 🎯 TopHeader (Header Superior)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `listas` | `useBiblioteca()` hook | data | TopHeader → FavoritesCarousel → FavoritosListItem |
| `usuarioPerfil` | `usuarioCompleto` (hook) | data | TopHeader → UserProfile |
| `onLogout` | prop padre | callback | TopHeader → UserMenu |
| `listaSeleccionadaId` | `state: setListaSeleccionadaId` | state | TopHeader → FavoritesCarousel |
| `onSeleccionarLista` | `handleSeleccionarLista()` | callback | TopHeader → FavoritesCarousel → FavoritosListItem |
| `onAbrirGestionListas` | `handleAbrirGestionListas()` | callback | TopHeader → FavoritesCarousel (botón +) |

**Árbol completo:**
```
Home
└── TopHeader
    ├── UserProfile (usuarioNombre, usuarioAvatar, onToggleMenu)
    ├── UserMenu (isOpen, onClose, onLogout)
    └── FavoritesCarousel (listas, listaSeleccionadaId, onSeleccionarLista, onAbrirGestionListas)
        └── FavoritosListItem (para cada lista)
```

---

## 🎵 PlaylistPanel (Panel de Playlist Izquierda)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `onSeleccionarCancion` | inline callback: `reproducirCancion()` | callback | PlaylistPanel → SongItem |
| `lista` | `listaSeleccionada` (memo) | data | PlaylistPanel (renderiza canciones) |
| `cancionActivaId` | `cancionActiva?.id` | state | PlaylistPanel → SongItem |
| `isPlaying` | `state: setIsPlaying` | state | PlaylistPanel → SongItem |
| `origenReproduccion` | `state: setOrigenReproduccion` | state | PlaylistPanel → SongItem (comparación) |

**Árbol completo:**
```
Home
└── PlaylistPanel
    └── SongItem (para cada canción)
        └── onSeleccionarCancion() → reproducirCancion() en Home
```

---

## 🎸 ExplorePanel (Panel Explorar Derecha)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `grupos` | `gruposFiltradosPorGenero` (memo) | data | ExplorePanel → GroupCard |
| `canciones` | `cancionesFiltradasPorGenero` (memo) | data | ExplorePanel → ExploreSongItem |
| `loading` | `loadingExplorar` (hook) | state | ExplorePanel (renderizado) |
| `error` | `errorExplorar` (hook) | state | ExplorePanel (renderizado) |
| `generoSeleccionado` | `state: setGeneroSeleccionado` | state | ExplorePanel (filtros) |
| `onSeleccionarCancion` | inline callback: `reproducirCancion()` | callback | ExplorePanel → ExploreSongItem |
| `cancionActivaId` | `cancionActiva?.id` | state | ExplorePanel → ExploreSongItem |
| `isPlaying` | `state: setIsPlaying` | state | ExplorePanel → ExploreSongItem |
| `origenReproduccion` | `state: setOrigenReproduccion` | state | ExplorePanel → ExploreSongItem (comparación) |

**Árbol completo:**
```
Home
├── CarouselGeneres (generos, generoSeleccionadoId, onSeleccionarGenero)
└── ExplorePanel
    ├── GroupCard (para cada grupo)
    └── ExploreSongItem (para cada canción)
        └── onSeleccionarCancion() → reproducirCancion() en Home
```

---

## 🎧 NowPlayingPanel (Panel Información Centro)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `cancion` | `cancionActiva` | state | NowPlayingPanel (renderizado) |
| `isPlaying` | `state: setIsPlaying` | state | NowPlayingPanel (renderizado) |

**Árbol completo:**
```
Home
└── NowPlayingPanel (información estática)
```

---

## ⏯️ PlayerBar (Barra Reproductor Inferior)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `cancion` | `cancionActiva` | state | PlayerBar (renderizado + audio) |
| `isPlaying` | `state: setIsPlaying` | state | PlayerBar (renderizado) |
| `onAlternarReproduccion` | inline: `setIsPlaying((prev) => !prev)` | callback | PlayerBar (botón play/pause) |
| `onSiguienteCancion` | `handleSiguienteCancion()` | callback | PlayerBar (botón siguiente) |
| `onAnteriorCancion` | `handleAnteriorCancion()` | callback | PlayerBar (botón anterior) |
| `shuffleActivo` | `state: setShuffleActivo` | state | PlayerBar (renderizado) |
| `repeatActivo` | `state: setRepeatActivo` | state | PlayerBar (renderizado) |
| `onAlternarShuffle` | `handleToggleShuffle()` | callback | PlayerBar (botón shuffle) |
| `onAlternarRepeat` | `handleToggleRepeat()` | callback | PlayerBar (botón repeat) |
| `onFinalizarCancion` | inline callback (lógica repeat/next) | callback | PlayerBar (evento audio onEnded) |

**Árbol completo:**
```
Home
└── PlayerBar
    └── <audio> element (src, onEnded)
```

---

## 📋 ModalFavoritos (Modal Gestión de Listas)

| Prop/Handler | Definido en Home | Tipo | Llega hasta |
|---|---|---|---|
| `isOpen` | `modalType` state | state | ModalFavoritos (visibilidad) |
| `onClose` | `handleCerrarModal()` | callback | ModalFavoritos (botón cerrar X) |
| `listas` | `useBiblioteca()` hook | data | ModalFavoritos → FavoritosList → FavoritosListItem |
| `listaSeleccionadaId` | `state: setListaSeleccionadaId` | state | ModalFavoritos → FavoritosList → FavoritosListItem |
| `onSeleccionarLista` | `handleSeleccionarLista()` | callback | ModalFavoritos → FavoritosList → FavoritosListItem |
| `onAbrirAgregarCancion` | `handleAbrirAgregarCancion()` | callback | ModalFavoritos → FavoritosConfig (botón "Registrar canción") |

**Árbol completo:**
```
Home
└── ModalFavoritos
    ├── FavoritosList (listas, listaSeleccionadaId, onSeleccionarLista)
    │   └── FavoritosListItem (para cada lista)
    └── FavoritosConfig (listaSeleccionada, onAbrirAgregarCancion)
        └── FavoritosFeaturedSong (información imagen/título)
```

---

## 🔄 Flujos de Eventos Principales

### Flujo 1: Reproducir Canción desde Playlist
```
Home.PlaylistPanel.SongItem.onSeleccionarCancion()
  ↓
Home.reproducirCancion(cancion, "PlaylistPanel", colaPlaylist)
  ↓
Home.setCancionActiva(cancion)
Home.setIsPlaying(true)
  ↓
PlayerBar recibe cancion/isPlaying actualizado
```

### Flujo 2: Reproducir Canción desde Explore
```
Home.ExplorePanel.ExploreSongItem.onSeleccionarCancion()
  ↓
Home.reproducirCancion(cancion, "ExplorePanel", colaExplore)
  ↓
Home.setCancionActiva(cancion)
Home.setIsPlaying(true)
  ↓
PlayerBar recibe cancion/isPlaying actualizado
```

### Flujo 3: Siguiente Canción
```
PlayerBar.onSiguienteCancion() ← handleSiguienteCancion()
  ↓
Home.handleSiguienteCancion()
  ↓
Home.reproducirCancion(siguienteCancion, origen, cola)
  ↓
PlayerBar recibe cancion/isPlaying actualizado
```

### Flujo 4: Seleccionar Lista
```
TopHeader.FavoritesCarousel.onSeleccionarLista()
  ↓ o ↓
ModalFavoritos.FavoritosList.FavoritosListItem.onSeleccionarLista()
  ↓
Home.handleSeleccionarLista(listaId)
  ↓
Home.setListaSeleccionadaId(listaId)
  ↓
Home.listaSeleccionada (memo recalcula)
  ↓
PlaylistPanel recibe lista actualizada
```

### Flujo 5: Abrir Modal Gestión
```
TopHeader.FavoritesCarousel.onAbrirGestionListas()
  ↓
Home.handleAbrirGestionListas()
  ↓
Home.setModalType("gestionarListas")
  ↓
ModalFavoritos.isOpen = true
```

### Flujo 6: Registrar Canción a Lista
```
ModalFavoritos.FavoritosConfig.onAbrirAgregarCancion(cancion)
  ↓
Home.handleAbrirAgregarCancion(cancion)
  ↓
Home.setSelectedSong(cancion)
Home.setModalType("addMusicList")
```

---

## 📊 Resumen de Estado Global (Home)

| Estado | Setter | Usado por | Tipo |
|---|---|---|---|
| `cancionActiva` | `setCancionActiva` | PlayerBar, PlaylistPanel, NowPlayingPanel, ExplorePanel | 🎵 current song |
| `isPlaying` | `setIsPlaying` | PlayerBar, PlaylistPanel, NowPlayingPanel, ExplorePanel | ▶️ play/pause |
| `listaSeleccionadaId` | `setListaSeleccionadaId` | TopHeader, ModalFavoritos, PlaylistPanel (indirectamente) | 📋 selected list |
| `generoSeleccionado` | `setGeneroSeleccionado` | CarouselGeneres, ExplorePanel | 🎸 filter genre |
| `shuffleActivo` | `setShuffleActivo` | PlayerBar, handleSiguienteCancion | 🔀 shuffle mode |
| `repeatActivo` | `setRepeatActivo` | PlayerBar, onFinalizarCancion | 🔁 repeat mode |
| `origenReproduccion` | `setOrigenReproduccion` | PlaylistPanel, ExplorePanel (comparación) | 📍 origin |
| `colaReproduccion` | `setColaReproduccion` | handleSiguienteCancion, handleAnteriorCancion | 🎶 queue |
| `historialShuffle` | `setHistorialShuffle` | handleSiguienteCancion, handleToggleShuffle | 📜 shuffle history |
| `modalType` | `setModalType` | ModalFavoritos.isOpen | 🪟 modal type |
| `selectedSong` | `setSelectedSong` | ModalFavoritos (indirectamente) | 🎵 modal song |

---

## 🎯 Nombres Unificados (Convención)

✅ **Callbacks siempre siguen este patrón:**
- `onSeleccionar...` → seleccionar algo (lista, canción, género)
- `onAbrir...` → abrir modal o panel
- `onAlternar...` → toggle boolean
- `onSiguiente/onAnterior` → navegación
- `onFinalizar...` → cuando algo termina
- `onCerrar...` → cerrar modal

✅ **Props de datos:**
- Singular para unidad (cancion, lista, genero)
- Plural para colecciones (canciones, listas, generos)
- `...Id` para identificadores
- `...Activo` para booleans de estado visual

---

**Última actualización:** 5 de mayo de 2026  
**Estado de componentes:** ✅ Todos los nombres unificados y rastreables
