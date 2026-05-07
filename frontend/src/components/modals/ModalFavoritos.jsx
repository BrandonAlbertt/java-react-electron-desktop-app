// ===============================
// IMPORTACIONES
// ===============================
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, X } from "lucide-react";

import FavoritosConfig from "./contents/favoritos/FavoritosConfig";
import FavoritosList from "./contents/favoritos/FavoritosList";

// ===============================
// HELPERS LOCALES
// ===============================
const MotionDiv = motion.div;

const obtenerIdsListasConCancion = (listas = [], selectedSong) => {
    if (!selectedSong?.id) return [];

    return listas
        .filter((lista) =>
            (lista.canciones || []).some((cancion) => cancion?.id === selectedSong.id)
        )
        .map((lista) => lista.id);
};

const tienenMismosIds = (idsA = [], idsB = []) => {
    if (idsA.length !== idsB.length) return false;

    const setB = new Set(idsB);
    return idsA.every((id) => setB.has(id));
};

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function ModalFavoritos({
    isOpen,
    onClose,
    listas = [],
    selectedSong,
    onGuardarCambios,
    onCrearLista,
    onEliminarLista,
}) {
    // =============================
    // ESTADOS
    // =============================
    const [seleccionOriginalIds, setSeleccionOriginalIds] = useState(() =>
        obtenerIdsListasConCancion(listas, selectedSong)
    );
    const [listasSeleccionadasIds, setListasSeleccionadasIds] = useState(() =>
        obtenerIdsListasConCancion(listas, selectedSong)
    );
    const [nombreNuevaLista, setNombreNuevaLista] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [errorAccion, setErrorAccion] = useState(null);

    // =============================
    // DATOS DERIVADOS
    // =============================
    const hayCambios = !tienenMismosIds(seleccionOriginalIds, listasSeleccionadasIds);
    const tituloCancion =
        selectedSong?.titulo || selectedSong?.title || "Selecciona una cancion";

    // =============================
    // FUNCIONES Y EVENTOS
    // =============================
    // alterna una lista sin tocar backend hasta guardar
    const handleToggleLista = (listaId) => {
        setListasSeleccionadasIds((prev) => {
            if (prev.includes(listaId)) {
                return prev.filter((id) => id !== listaId);
            }

            return [...prev, listaId];
        });
    };

    // compara el estado inicial contra el actual y envia solo diferencias
    const handleGuardarCambios = async () => {
        if (!selectedSong?.id || !hayCambios) return;

        const setOriginal = new Set(seleccionOriginalIds);
        const setActual = new Set(listasSeleccionadasIds);

        const listasAgregar = listasSeleccionadasIds.filter((id) => !setOriginal.has(id));
        const listasQuitar = seleccionOriginalIds.filter((id) => !setActual.has(id));

        try {
            setIsWorking(true);
            setErrorAccion(null);

            await onGuardarCambios?.({
                listasAgregar,
                listasQuitar,
                song: selectedSong,
            });

            onClose?.();
        } catch (error) {
            console.error("[ModalFavoritos] error guardando cambios:", error);
            setErrorAccion("No se pudieron guardar los cambios.");
        } finally {
            setIsWorking(false);
        }
    };

    // crea una nueva lista usando la portada de la cancion actual
    const handleCrearNuevaLista = async () => {
        const nombre = nombreNuevaLista.trim();
        if (!nombre) return;

        try {
            setIsWorking(true);
            setErrorAccion(null);

            await onCrearLista?.(nombre, selectedSong);
            setNombreNuevaLista("");
        } catch (error) {
            console.error("[ModalFavoritos] error creando lista:", error);
            setErrorAccion("No se pudo crear la lista.");
        } finally {
            setIsWorking(false);
        }
    };

    // elimina la lista y limpia su seleccion local
    const handleEliminarLista = async (listaId) => {
        try {
            setIsWorking(true);
            setErrorAccion(null);

            await onEliminarLista?.(listaId);
            setSeleccionOriginalIds((prev) => prev.filter((id) => id !== listaId));
            setListasSeleccionadasIds((prev) => prev.filter((id) => id !== listaId));
        } catch (error) {
            console.error("[ModalFavoritos] error eliminando lista:", error);
            setErrorAccion("No se pudo eliminar la lista.");
        } finally {
            setIsWorking(false);
        }
    };

    // =============================
    // RENDER PRINCIPAL
    // =============================
    return (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    className="
                        fixed inset-0 z-[999] flex items-center justify-center
                        bg-black/65 px-3 py-4 backdrop-blur-xl
                        sm:px-5 sm:py-6
                    "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <MotionDiv
                        className="
                            relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden
                            rounded-[1.6rem] border border-fuchsia-500/25
                            bg-[#070710]/95 shadow-[0_0_90px_rgba(217,70,239,0.20)]
                            sm:rounded-[2rem]
                        "
                        initial={{ scale: 0.94, opacity: 0, y: 24 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.94, opacity: 0, y: 24 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-fuchsia-500/10 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-0 right-20 h-40 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

                        <div
                            className="
                                relative flex shrink-0 items-center justify-between gap-4
                                border-b border-white/10 px-5 py-5
                                sm:px-8 sm:py-6
                            "
                        >
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <div
                                    className="
                                        flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                                        border border-fuchsia-400/60 bg-fuchsia-500/15
                                        text-fuchsia-300 shadow-[0_0_26px_rgba(217,70,239,0.35)]
                                        sm:h-14 sm:w-14
                                    "
                                >
                                    <Music size={28} />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">
                                        Gestor de musica
                                    </h2>

                                    <p className="mt-1 line-clamp-1 text-xs text-white/55 sm:text-sm">
                                        {tituloCancion}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl
                                    border border-fuchsia-500/35 bg-fuchsia-500/10
                                    text-white/80 transition hover:bg-fuchsia-500/20 hover:text-white
                                    sm:h-11 sm:w-11
                                "
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div
                            className="
                                custom-scrollbar relative min-h-0 flex-1 overflow-y-auto
                                px-5 py-5 sm:px-8 sm:py-6
                            "
                        >
                            <div
                                className="
                                    grid min-h-full grid-cols-1 gap-6
                                    lg:grid-cols-[1.05fr_1fr] lg:gap-8
                                "
                            >
                                <FavoritosList
                                    listas={listas}
                                    listasSeleccionadasIds={listasSeleccionadasIds}
                                    isWorking={isWorking}
                                    onSeleccionarLista={handleToggleLista}
                                    onEliminarLista={handleEliminarLista}
                                />

                                <FavoritosConfig
                                    selectedSong={selectedSong}
                                    nombreNuevaLista={nombreNuevaLista}
                                    onCambiarNombreNuevaLista={setNombreNuevaLista}
                                    onCrearNuevaLista={handleCrearNuevaLista}
                                    onGuardarCambios={handleGuardarCambios}
                                    hayCambios={hayCambios}
                                    isWorking={isWorking}
                                    errorAccion={errorAccion}
                                />
                            </div>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
}
