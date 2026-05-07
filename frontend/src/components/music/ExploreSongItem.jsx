// ===============================
// IMPORTACIONES
// ===============================
import { Music, Pause, Play } from "lucide-react";
import MarqueeText from "./MarqueeText";

/*
  ExploreSongItem representa una sola cancion dentro de Explore.
  Solo recibe datos y avisa eventos al componente padre.
*/

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function ExploreSongItem({
    song,
    groupImage,
    groupName,
    onSeleccionarCancion,
    onAbrirModalFavoritos,
    isAdded = false,
    isActive = false,
    isPlaying = false,
}) {
    // ===============================
    // DATOS DERIVADOS
    // ===============================
    const songTitle = song?.title || song?.titulo || "Cancion sin titulo";
    const songGroup = groupName || song?.groupName || song?.grupo || "Grupo desconocido";
    const songImage = groupImage || song?.groupImage || song?.imagen_url || "";
    const songDuration = song?.duration || song?.duracion_segundos || 0;

    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    // convierte segundos a mm:ss si duration viene como numero
    const formatDuration = (duration) => {
        if (!duration) return "0:00";

        if (typeof duration === "string") {
            return duration;
        }

        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);

        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    // ===============================
    // RENDER PRINCIPAL
    // ===============================
    return (
        <div
            className={`relative flex items-center gap-3 rounded-full px-4 py-3 transition duration-300 ${
                isActive
                    ? "z-10 overflow-hidden border border-fuchsia-500/35 bg-[#15151f]"
                    : "bg-black hover:bg-[#0d0d12]"
            }`}
        >
            {isActive && (
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_18%_50%,rgba(217,70,239,0.34),rgba(217,70,239,0.14)_40%,transparent_72%)]" />
            )}

            <button
                type="button"
                onClick={() => onSeleccionarCancion?.(song)}
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-110"
                title={isPlaying ? "Pausar" : "Reproducir"}
            >
                {isPlaying ? (
                    <Pause size={22} fill="currentColor" />
                ) : (
                    <Play size={22} fill="currentColor" />
                )}
            </button>

            {songImage ? (
                <img
                    src={songImage}
                    alt={songGroup}
                    className={`relative z-10 h-12 w-12 shrink-0 rounded-full object-cover transition ${
                        isActive ? "ring-1 ring-fuchsia-500/45" : ""
                    }`}
                />
            ) : (
                <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white/45 transition ${
                        isActive ? "ring-1 ring-fuchsia-500/45" : ""
                    }`}
                >
                    <Music size={18} />
                </div>
            )}

            <div className="relative z-10 min-w-0 flex-1">
                <MarqueeText
                    text={songTitle}
                    className={`text-lg font-bold ${isActive ? "text-fuchsia-300" : "text-white"}`}
                    speed={14}
                />

                <MarqueeText
                    text={songGroup}
                    className={`text-sm ${isActive ? "text-white/80" : "text-white/60"}`}
                    speed={13}
                />
            </div>

            <span
                className={`relative z-10 shrink-0 text-sm ${
                    isActive ? "text-white" : "text-white/75"
                }`}
            >
                {formatDuration(songDuration)}
            </span>

            <button
                type="button"
                onClick={() => onAbrirModalFavoritos?.(song)}
                className={`relative z-10 ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl font-bold transition hover:scale-110
                    ${isAdded
                        ? "text-red-500 hover:text-red-400"
                        : "text-green-400 hover:text-green-300"
                    }`}
                title="Gestionar en listas"
            >
                {isAdded ? "X" : "+"}
            </button>
        </div>
    );
}
