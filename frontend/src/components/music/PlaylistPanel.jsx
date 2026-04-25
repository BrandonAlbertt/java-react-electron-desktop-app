import { useEffect, useRef, useState } from "react";
import SongItem from "./SongItem";

/*
  Guia corta para entender este archivo (nivel principiante):
  - PlaylistPanel es un componente padre: organiza el panel izquierdo y renderiza la lista de canciones.
  - Home usa este componente y no le pasa props directas; PlaylistPanel controla su estado local.
  - Usa SongItem como componente reutilizable para mostrar cada canción con portada, texto y controles.
  - Flujo de eventos: los clicks en play, eliminar y flecha ejecutan callbacks locales que actualizan la interfaz.
  - Estilo especial no estándar: usa gradientes personalizados y clases para ocultar la barra de scroll.
*/

// LISTA DE CANCIONES (DATOS DE EJEMPLO)
const songs = [
  {
    id: 1,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 2,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 3,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 4,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 5,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 6,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
  {
    id: 7,
    title: "Nombre de canción",
    artist: "Grupo o artista",
    duration: "3:20",
    image: "https://i.imgur.com/8Km9tLL.jpeg",
  },
];

export default function PlaylistPanel() {
  // ESTADO DE REPRODUCCIÓN ACTUAL
  const activeSongId = 1;
  const isPlaying = true;

  // REFERENCIA A LA LISTA SCROLLEABLE
  const listRef = useRef(null);

  // ESTADO PARA MOSTRAR/OCULTAR FLECHA INFERIOR
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  // ACCIÓN AL PRESIONAR PLAY/PAUSA
  const handlePlay = (song) => {
    console.log("Reproducir o pausar:", song);
  };

  // ACCIÓN AL ELIMINAR CANCIÓN
  const handleRemove = (id) => {
    console.log("Eliminar canción:", id);
  };

  // VERIFICA SI TODAVÍA HAY CONTENIDO DEBAJO EN EL SCROLL
  const checkScrollState = () => {
    const el = listRef.current;
    if (!el) return;

    const hasMoreBelow = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
    setShowBottomArrow(hasMoreBelow);
  };

  // BAJA LA LISTA SUAVEMENTE AL PRESIONAR LA FLECHA
  const handleScrollDown = () => {
    const el = listRef.current;
    if (!el) return;

    el.scrollBy({
      top: 220,
      behavior: "smooth",
    });
  };

  // EFECTO: ACTIVA LISTENERS DE SCROLL Y RESIZE
  useEffect(() => {
    checkScrollState();

    const el = listRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, []);

  return (
    // CONTENEDOR PRINCIPAL DEL PANEL
    <section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-fuchsia-500/20 bg-[#07070b]">
      {/* HEADER SUPERIOR */}
      <div className="relative shrink-0 rounded-t-[2rem] bg-black px-5 pb-5 pt-6">
        {/* FILA: PORTADA + TEXTOS */}
        <div className="flex items-center gap-4 pl-24">
          {/* PORTADA REDONDA CON BORDE VERDE Y GLOW */}
          {/* POSICIÓN DEL CÍRCULO: CAMBIA LEFT-* Y TOP-* PARA MOVERLO */}
          <div className="absolute left-6 top-[-8px] shrink-0">
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-xl" />
            <div className="absolute inset-0 rounded-full border border-green-400/35 shadow-[0_0_22px_rgba(74,222,128,0.45)]" />
            <img
              src="https://i.imgur.com/Nh6G6xG.jpeg"
              alt="cover"
              className="relative h-24 w-24 rounded-full object-cover ring-2 ring-green-400/40"
            />
          </div>

          {/* TEXTO AL COSTADO DE LA PORTADA */}
          <div className="min-w-0 pl-5 items-center">
            {/* TÍTULO DE LA LISTA */}
            <p className="truncate text-[1.7rem] font-semibold text-white">
              Lista Favorita 3
            </p>
            {/* SUBTÍTULO / DESCRIPCIÓN */}
            <p className="text-sm text-white/45">Mis canciones guardadas</p>
          </div>
        </div>
      </div>

      {/* ZONA INFERIOR CON LISTA DE CANCIONES */}
      <div className="relative min-h-0 flex-1">
        {/* CONTENIDO SCROLLEABLE (LISTA) */}
        <div
          ref={listRef}
          className="no-scrollbar h-full overflow-y-auto px-4 pb-20 pt-5"
        >
          {/* AGRUPADOR DE ITEMS */}
          <div className="space-y-2">
            {songs.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                isActive={song.id === activeSongId}
                isPlaying={song.id === activeSongId && isPlaying}
                onPlay={handlePlay}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* DIFUMINADO INFERIOR PARA CORTE SUAVE */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[2rem] bg-gradient-to-t from-[#07070b] via-[#07070b]/88 to-transparent" />

        {/* BOTÓN FLECHA INFERIOR (SOLO SI HAY MÁS CONTENIDO) */}
        {showBottomArrow && (
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
            <button
              onClick={handleScrollDown}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/30 bg-black/55 backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-fuchsia-400/50"
              title="Ver más canciones"
            >
              {/* ÍCONO DE FLECHA */}
              <span className="text-[2rem] leading-none text-violet-400 transition group-hover:text-fuchsia-300">
                ▽
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/*
  Uso rapido en un componente padre:

  import PlaylistPanel from "../components/music/PlaylistPanel";

  <aside className="col-span-12 min-h-0 lg:col-span-4">
    <PlaylistPanel />
  </aside>

  Condiciones minimas:
  - El contenedor padre debe tener altura disponible (h-full/min-h-0) para que el scroll funcione
  - Debe existir SongItem y la clase no-scrollbar en estilos globales
  - Si cambias la data, cada cancion debe incluir: id, title, artist, duration e image
*/