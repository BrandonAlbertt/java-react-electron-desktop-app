// ===============================
// IMPORTACIONES
// ===============================
import { Pause, Play } from "lucide-react";
import MarqueeText from "./MarqueeText";

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function SongItem({
    song,
    isActive = false,
    isPlaying = false,
    isAdded = false,
    onSeleccionarCancion,
    onAbrirModalFavoritos,
}) {
    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    // convierte segundos a formato mm:ss
    const formatTime = (seconds) => {
        if (!seconds) return "0:00";

        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    // ===============================
    // RENDER PRINCIPAL
    // ===============================
    return (
        <div
            className={`group flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-all duration-300 sm:gap-3 sm:px-4 sm:py-2
                ${isActive
                    ? "scale-[1.01] border border-fuchsia-500/45 bg-[#12121a] shadow-[0_0_24px_rgba(168,85,247,0.30)]"
                    : "scale-[0.985] border border-white/5 bg-black/85 hover:scale-[0.995] hover:border-fuchsia-500/25 hover:bg-[#0d0d12]"
                }`}
        >
            <button
                type="button"
                onClick={() => onSeleccionarCancion?.(song)}
                className={`flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110
                    ${isActive
                        ? "h-9 w-9 border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
                        : "h-8 w-8 border-white/10 bg-white/5 text-white/90"
                    }`}
            >
                {isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                ) : (
                    <Play size={16} fill="currentColor" />
                )}
            </button>

            <div className="relative shrink-0">
                <img
                    src={song.imagen_grupo}
                    className={`rounded-full object-cover transition-all duration-300
                        ${isActive
                            ? "h-10 w-10 ring-2 ring-fuchsia-400/40"
                            : "h-9 w-9 ring-1 ring-white/10"
                        }`}
                />
            </div>

            <div className="min-w-0 flex-1">
                <MarqueeText
                    text={song.titulo}
                    className="text-sm font-bold text-white"
                />

                <MarqueeText
                    text={song.grupo}
                    className="text-xs text-white/50"
                />
            </div>

            <span className="hidden text-sm text-white/60 sm:block">
                {formatTime(song.duracion_segundos)}
            </span>

            <button
                type="button"
                onClick={() => onAbrirModalFavoritos?.(song)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110
                    ${isAdded
                        ? "border-red-500/25 text-red-500"
                        : "border-green-400/20 text-green-400"
                    }`}
            >
                {isAdded ? "X" : "+"}
            </button>
        </div>
    );
}
