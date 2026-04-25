import MarqueeText from "./MarqueeText";

/*
 * SongItem.jsx
 * Renderiza una canción dentro de la lista con controles y datos básicos.
 */
export default function SongItem({
  song,
  isActive = false,
  isPlaying = false,
  onPlay,
  onRemove,
}) {
  return (
    <div
      className={`
        flex items-center gap-2 rounded-full px-2.5 py-1 transition-all duration-300
        sm:gap-3 sm:px-4 sm:py-2
        ${
          isActive
            ? "scale-[1.01] border border-fuchsia-500/45 bg-[#111117] shadow-[0_0_22px_rgba(168,85,247,0.28)]"
            : "scale-[0.985] bg-black hover:scale-[0.99] hover:bg-[#0d0d12]"
        }
      `}
    >
      {/* 1) Botón Play / Pausa */}
      <button
        onClick={() => onPlay?.(song)}
        className={`
          flex shrink-0 items-center justify-center rounded-full text-white transition hover:scale-105
          ${isActive ? "h-9 w-9 sm:h-10 sm:w-10" : "h-8 w-8 sm:h-9 sm:w-9"}
        `}
      >
        {isPlaying ? (
          <span className="text-[1.7rem] leading-none sm:text-[1.95rem]">❚❚</span>
        ) : (
          <span className="text-[1.7rem] leading-none sm:text-[1.95rem]">▶</span>
        )}
      </button>

      {/* 2) Portada de la canción (con glow si está activa) */}
      <div className="relative shrink-0">
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-fuchsia-500/20 blur-md" />
            <div className="absolute inset-0 rounded-full border border-fuchsia-500/35 shadow-[0_0_18px_rgba(217,70,239,0.35)]" />
          </>
        )}

        <img
          src={song.image}
          alt={song.title}
          className={`
            relative rounded-full object-cover transition-all duration-300
            ${
              isActive
                ? "h-9 w-9 ring-2 ring-fuchsia-500/35 sm:h-11 sm:w-11"
                : "h-9 w-9 sm:h-10 sm:w-10"
            }
          `}
        />
      </div>

      {/* 3) Texto: título y artista (con Marquee) */}
      <div className="min-w-0 flex-1">
        <MarqueeText
          text={song.title}
          className="text-[clamp(0.72rem,1.45vw,1.18rem)] font-bold leading-tight text-white"
          speed={14}
        />

        <MarqueeText
          text={song.artist}
          className="text-[clamp(0.62rem,1.1vw,0.88rem)] leading-tight text-white/70"
          speed={13}
        />
      </div>

      {/* 4) Duración */}
      <span className="shrink-0 pl-1 text-[clamp(0.78rem,1.6vw,1.12rem)] text-white/80 sm:pl-2">
        {song.duration}
      </span>

      {/* 5) Botón eliminar */}
      <button
        onClick={() => onRemove?.(song.id)}
        className="ml-1 shrink-0 text-[clamp(1.15rem,2.4vw,1.9rem)] font-bold leading-none text-red-500 transition hover:scale-110 hover:text-red-400"
      >
        X
      </button>
    </div>
  );
}