import { Music, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import FavoritosList from "./contents/favoritos/FavoritosList";
import FavoritosConfig from "./contents/favoritos/FavoritosConfig";

/*
  ModalFavoritos.jsx

  modal principal para gestionar favoritos.
  este archivo tiene la estructura general del modal:
  fondo, blur, cabecera, botón cerrar y contenido adaptable.
*/

const listasDemo = [
    {
        id: 1,
        nombre: "Mis Favoritas",
        canciones: 4,
        imagen:
            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300",
    },
    {
        id: 2,
        nombre: "Noche Profunda",
        canciones: 2,
        imagen:
            "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300",
    },
    {
        id: 3,
        nombre: "Rock Clásico",
        canciones: 3,
        imagen:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
    },
    {
        id: 4,
        nombre: "Canciones pop",
        canciones: 5,
        imagen:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300",
    },
];

export default function ModalFavoritos({
    isOpen,
    onClose,
    listas = listasDemo,
    listaSeleccionadaId = 1,
    onSeleccionarLista,
    onAbrirAgregarCancion,
}) {
    // =============================
    // DATOS DERIVADOS
    // =============================
    // busca la lista seleccionada usando el id recibido
    const listaSeleccionada =
        listas.find((lista) => lista.id === listaSeleccionadaId) || listas[0];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="
                        fixed inset-0 z-[999] flex items-center justify-center
                        bg-black/65 px-3 py-4 backdrop-blur-xl
                        sm:px-5 sm:py-6
                    "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* ============================= */}
                    {/* MODAL PRINCIPAL */}
                    {/* ============================= */}
                    <motion.div
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
                        {/* brillo decorativo superior */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-fuchsia-500/10 blur-3xl" />

                        {/* brillo decorativo inferior */}
                        <div className="pointer-events-none absolute bottom-0 right-20 h-40 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

                        {/* ============================= */}
                        {/* CABECERA DEL MODAL */}
                        {/* ============================= */}
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
                                        Gestor de música
                                    </h2>

                                    <p className="mt-1 line-clamp-1 text-xs text-white/55 sm:text-sm">
                                        Administra tus listas y canciones favoritas
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

                        {/* ============================= */}
                        {/* CONTENIDO DEL MODAL */}
                        {/* ============================= */}
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
                                {/* columna izquierda */}
                                <FavoritosList
                                    listas={listas}
                                    listaSeleccionadaId={listaSeleccionada?.id}
                                    onSeleccionarLista={onSeleccionarLista}
                                />

                                {/* columna derecha */}
                                <FavoritosConfig
                                    listaSeleccionada={listaSeleccionada}
                                    onAbrirAgregarCancion={onAbrirAgregarCancion}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}