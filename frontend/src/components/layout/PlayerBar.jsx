// ===============================
// IMPORTACIONES
// ===============================
import { useEffect, useRef, useState } from "react";
import {
    Pause,
    Play,
    Plus,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
} from "lucide-react";

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function PlayerBar({
    cancion,
    isPlaying,
    onAlternarReproduccion,
    onSiguienteCancion,
    onAnteriorCancion,
    shuffleActivo,
    repeatActivo,
    onAlternarShuffle,
    onAlternarRepeat,
    onFinalizarCancion,
    onAbrirModalFavoritos,
}) {
    // ===============================
    // ESTADOS Y REFERENCIAS
    // ===============================
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.65);

    // ===============================
    // DATOS DERIVADOS
    // ===============================
    const hasSong = !!cancion;

    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    const formatTime = (seconds) => {
        if (!seconds) return "0:00";

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
    };

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = Number(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // ===============================
    // EFECTOS SECUNDARIOS
    // ===============================
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !hasSong) return;

        audio.volume = volume;

        if (isPlaying) {
            audio.play().catch((error) => {
                console.log("No se pudo reproducir:", error);
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, cancion, hasSong, volume]);

    // ===============================
    // RENDER PRINCIPAL
    // ===============================
    return (
        <div className="flex h-full w-full items-center justify-center">
            <audio
                ref={audioRef}
                src={cancion?.link_audio || ""}
                onTimeUpdate={handleTimeUpdate}
                onEnded={onFinalizarCancion}
            />

            <div className="flex h-full w-full max-w-[1400px] items-center justify-between gap-4 rounded-[1.8rem] border border-fuchsia-500/10 bg-[#050507] px-4 md:px-6">
                <div className="flex min-w-0 w-[28%] items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-fuchsia-500/10 blur-md" />
                        <img
                            src={cancion?.imagen_grupo || "https://via.placeholder.com/60"}
                            alt={cancion?.titulo || "Portada de cancion"}
                            className="relative h-12 w-12 rounded-full object-cover ring-1 ring-fuchsia-500/20"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            {cancion?.titulo || "Sin cancion"}
                        </p>
                        <p className="truncate text-xs text-white/60">
                            {cancion?.grupo || "Selecciona una cancion"}
                        </p>
                    </div>
                </div>

                <div className="flex max-w-[620px] flex-1 flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-5 text-fuchsia-400">
                        <button
                            onClick={onAnteriorCancion}
                            disabled={!cancion}
                            className="transition hover:scale-110 hover:text-fuchsia-300 disabled:opacity-30"
                        >
                            <SkipBack size={18} />
                        </button>

                        <button
                            onClick={() => {
                                if (hasSong) {
                                    onAlternarReproduccion?.();
                                }
                            }}
                            disabled={!hasSong}
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition ${
                                hasSong
                                    ? "bg-fuchsia-600 shadow-[0_0_18px_rgba(217,70,239,0.35)] hover:scale-105 hover:bg-fuchsia-500"
                                    : "cursor-not-allowed bg-white/10 text-white/30"
                            }`}
                        >
                            {isPlaying ? (
                                <Pause size={18} fill="currentColor" />
                            ) : (
                                <Play size={18} fill="currentColor" />
                            )}
                        </button>

                        <button
                            onClick={onSiguienteCancion}
                            disabled={!cancion}
                            className="transition hover:scale-110 hover:text-fuchsia-300 disabled:opacity-30"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>

                    <div className="flex w-full items-center gap-2">
                        <span className="text-xs text-white/60">
                            {formatTime(currentTime)}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max={cancion?.duracion_segundos || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            disabled={!hasSong}
                            className="h-1 flex-1 cursor-pointer accent-fuchsia-500"
                        />

                        <span className="text-xs text-white/60">
                            {formatTime(cancion?.duracion_segundos)}
                        </span>
                    </div>
                </div>

                <div className="flex w-[28%] items-center justify-end gap-3">
                    <button
                        onClick={onAlternarShuffle}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            shuffleActivo
                                ? "bg-fuchsia-500/15 text-fuchsia-300"
                                : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-fuchsia-300"
                        }`}
                    >
                        <Shuffle size={16} />
                    </button>

                    <button
                        onClick={onAlternarRepeat}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            repeatActivo
                                ? "bg-green-500/15 text-green-300"
                                : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-fuchsia-300"
                        }`}
                    >
                        <Repeat size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onAbrirModalFavoritos?.(cancion)}
                        disabled={!hasSong}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-fuchsia-400 transition hover:bg-white/10 hover:text-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Gestionar en listas"
                    >
                        <Plus size={18} />
                    </button>

                    <div className="ml-2 flex items-center gap-2">
                        <Volume2 size={17} className="text-white/65" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="h-1 w-24 cursor-pointer accent-fuchsia-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
