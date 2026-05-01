import MarqueeText from "./MarqueeText";

/*
 * SongItem.jsx
 *
 * Este componente NO decide qué canción está sonando.
 * Solo recibe estados desde el padre:
 *
 * isActive  = esta canción es la seleccionada
 * isPlaying = esta canción está reproduciéndose
 * isAdded   = esta canción ya está agregada a la lista
 *
 * Botón play:
 * - Si no está activa, la reproduce
 * - Si está activa y sonando, la pausa
 *
 * Botón + / X:
 * - Si isAdded es false, muestra +
 * - Si isAdded es true, muestra X
 */
export default function SongItem({
  song,
  isActive = false,
  isPlaying = false,
  isAdded = false,
  onPlay,
  onToggleList,
}) {
  return (
    <div
      className={`
        group flex items-center gap-2 rounded-full px-2.5 py-1.5
        transition-all duration-300 sm:gap-3 sm:px-4 sm:py-2
        ${isActive
          ? "scale-[1.01] border border-fuchsia-500/45 bg-[#12121a] shadow-[0_0_24px_rgba(168,85,247,0.30)]"
          : "scale-[0.985] border border-white/5 bg-black/85 hover:scale-[0.995] hover:border-fuchsia-500/25 hover:bg-[#0d0d12]"
        }
      `}
    >
      {/* BOTÓN PLAY / PAUSE */}
      <button
        type="button"
        onClick={() => onPlay?.(song)}
        title={isPlaying ? "Pausar canción" : "Reproducir canción"}
        className={`
          flex shrink-0 items-center justify-center rounded-full border
          transition-all duration-300 hover:scale-110
          ${isActive
            ? "h-9 w-9 border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_16px_rgba(217,70,239,0.25)] sm:h-10 sm:w-10"
            : "h-8 w-8 border-white/10 bg-white/5 text-white/90 hover:border-fuchsia-400/35 hover:bg-fuchsia-500/10 sm:h-9 sm:w-9"
          }
        `}
      >
        {isPlaying ? (
          <span className="text-[1.25rem] leading-none sm:text-[1.45rem]">
            ❚❚
          </span>
        ) : (
          <span className="translate-x-[1px] text-[1.25rem] leading-none sm:text-[1.45rem]">
            ▶
          </span>
        )}
      </button>

      {/* PORTADA */}
      <div className="relative shrink-0">
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-fuchsia-500/25 blur-md" />
            <div className="absolute inset-0 rounded-full border border-fuchsia-400/40 shadow-[0_0_18px_rgba(217,70,239,0.35)]" />
          </>
        )}

        <img
          src={song.image}
          alt={song.title}
          className={`
            relative rounded-full object-cover transition-all duration-300
            ${isActive
              ? "h-10 w-10 ring-2 ring-fuchsia-400/40 sm:h-11 sm:w-11"
              : "h-9 w-9 ring-1 ring-white/10 group-hover:ring-fuchsia-400/25 sm:h-10 sm:w-10"
            }
          `}
        />
      </div>

      {/* TEXTO */}
      <div className="min-w-0 flex-1">
        <MarqueeText
          text={song.title}
          className={`
            text-[clamp(0.74rem,1.45vw,1.12rem)] font-bold leading-tight
            ${isActive ? "text-white" : "text-white/90"}
          `}
          speed={14}
        />

        <MarqueeText
          text={song.artist}
          className="text-[clamp(0.62rem,1.1vw,0.86rem)] leading-tight text-white/55"
          speed={13}
        />
      </div>

      {/* DURACIÓN */}
      <span className="hidden shrink-0 pl-1 text-[clamp(0.74rem,1.4vw,1rem)] text-white/60 sm:block sm:pl-2">
        {song.duration}
      </span>

      {/* BOTÓN ÚNICO: + O X */}
      <button
        type="button"
        onClick={() => onToggleList?.(song)}
        title={isAdded ? "Eliminar de la lista" : "Agregar a la lista"}
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          border text-[1.2rem] font-bold leading-none
          transition-all duration-300 hover:scale-110
          ${isAdded
            ? "border-red-500/25 bg-red-500/5 text-red-500 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
            : "border-green-400/20 bg-green-400/5 text-green-400 hover:border-green-300/40 hover:bg-green-400/10 hover:text-green-300"
          }
        `}
      >
        {isAdded ? "X" : "+"}
      </button>
    </div>
  );
}