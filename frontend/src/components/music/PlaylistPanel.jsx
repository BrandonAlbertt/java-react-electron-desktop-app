// ===============================
// IMPORTACIONES
// ===============================
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { normalizeSong } from "../../utils/normalizeSong";
import SongItem from "./SongItem";

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function PlaylistPanel({
    lista,
    onSeleccionarCancion,
    isPlaying,
    cancionActivaId,
    origenReproduccion,
    onAbrirModalFavoritos,
}) {
    // ===============================
    // ESTADOS Y REFERENCIAS
    // ===============================
    const listRef = useRef(null);
    const [showBottomArrow, setShowBottomArrow] = useState(false);

    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    // envia la cancion al padre para reproducirla
    const handleSeleccionarCancion = (cancion) => {
        onSeleccionarCancion?.(cancion);
    };

    // envia la cancion a Home para abrir el modal global
    const handleAbrirFavoritos = (song) => {
        onAbrirModalFavoritos?.(song);
    };

    // muestra la flecha si hay mas canciones fuera de vista
    const checkScrollState = () => {
        const el = listRef.current;
        if (!el) return;

        const hasMoreBelow = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
        setShowBottomArrow(hasMoreBelow);
    };

    // baja el scroll suavemente al presionar la flecha
    const handleScrollDown = () => {
        const el = listRef.current;
        if (!el) return;

        el.scrollBy({
            top: 220,
            behavior: "smooth",
        });
    };

    // ===============================
    // EFECTOS SECUNDARIOS
    // ===============================
    // recalcula el estado del scroll cuando cambia la lista
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
    }, [lista]);

    // ===============================
    // RENDER PRINCIPAL
    // ===============================
    if (!lista) {
        return (
            <div className="flex h-full items-center justify-center rounded-[2rem] border border-fuchsia-500/20 bg-[#07070b] text-white/40">
                Selecciona una lista
            </div>
        );
    }

    return (
        <section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-fuchsia-500/20 bg-[#07070b]">
            <div className="relative shrink-0 rounded-t-[2rem] bg-black px-5 pb-5 pt-6">
                <div className="flex items-center gap-4 pl-24">
                    <div className="absolute left-6 top-[-8px] shrink-0">
                        <div className="absolute inset-0 rounded-full bg-green-400/20 blur-xl" />
                        <div className="absolute inset-0 rounded-full border border-green-400/35 shadow-[0_0_22px_rgba(74,222,128,0.45)]" />

                        <img
                            src={lista.imagen}
                            alt={lista.nombre}
                            className="relative h-24 w-24 rounded-full object-cover ring-2 ring-green-400/40"
                        />
                    </div>

                    <div className="min-w-0 pl-5">
                        <p className="truncate text-[1.7rem] font-semibold text-white">
                            {lista.nombre}
                        </p>

                        <p className="text-sm text-white/45">
                            {lista.canciones?.length || 0} canciones
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative min-h-0 flex-1">
                <div
                    ref={listRef}
                    className="no-scrollbar h-full overflow-y-auto px-4 pb-20 pt-5"
                >
                    <div className="space-y-2">
                        {lista.canciones?.map((songRaw) => {
                            const song = normalizeSong(songRaw);

                            return (
                                <SongItem
                                    key={song.id}
                                    song={song}
                                    isActive={song.id === cancionActivaId && origenReproduccion === "PlaylistPanel"}
                                    isPlaying={
                                        song.id === cancionActivaId &&
                                        origenReproduccion === "PlaylistPanel" &&
                                        isPlaying
                                    }
                                    isAdded={true}
                                    onSeleccionarCancion={handleSeleccionarCancion}
                                    onAbrirModalFavoritos={handleAbrirFavoritos}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[2rem] bg-gradient-to-t from-[#07070b] via-[#07070b]/88 to-transparent" />

                {showBottomArrow && (
                    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
                        <button
                            type="button"
                            onClick={handleScrollDown}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/30 bg-black/55 backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-fuchsia-400/50"
                            title="Ver mas canciones"
                        >
                            <ChevronDown
                                size={30}
                                className="text-violet-400 transition group-hover:text-fuchsia-300"
                            />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
