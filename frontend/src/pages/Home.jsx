import { useState, useMemo } from "react";

import PlayerBar from "../components/layout/PlayerBar";
import PlaylistPanel from "../components/music/PlaylistPanel";
import NowPlayingPanel from "../components/music/NowPlayingPanel";
import ExplorePanel from "../components/music/ExplorePanel";
import TopHeader from "../components/layout/TopHeader";
import CarouselGeneres from "../components/music/CarouselGeneres";

import AppModal from "../components/layout/AppModal";

import { useBiblioteca } from "../hooks/useBiblioteca";

export default function Home({usuario, onLogout}) {
    // =============================
    // ESTADOS PRINCIPALES
    // =============================
    // Datos de usuario y biblioteca
    const usuarioId = usuario?.id;
    const {
        usuario: usuarioCompleto, //por conflicto de nombres, se renombra a usuarioCompleto
        listas,
        canciones,
        loading,
        error
    } = useBiblioteca(usuarioId);

    // Estado global de la canción seleccionada
    const [cancionActiva, setCancionActiva] = useState(null);
    // estado de la cancion selecionada
    const [isPlaying, setIsPlaying] = useState(false);
    // Estado de la lista seleccionada
    const [listaSeleccionadaId, setListaSeleccionadaId] = useState(null);
    // Estado del modal y canción seleccionada para el modal
    const [modalType, setModalType] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);

    // =============================
    // MEMOS DERIVADOS
    // =============================
    // Obtener la lista seleccionada a partir del id
    const listaSeleccionada = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
    }, [listas, listaSeleccionadaId]);

    // =============================
    // FUNCIONES Y EVENTOS AGRUPADOS
    // =============================
    // Selección de canción
    const handleSeleccionarCancion = (song) => {
        // Si la canción seleccionada es la misma que la activa, solo alternar play/pause
        if (cancionActiva?.id === song.id) {
            // Alternar estado de reproducción
            setIsPlaying((prev) => !prev);
            return;
        }
        setCancionActiva(song);
        setIsPlaying(true);
    };

    // Selección de lista
    const handleSeleccionarLista = (listaId) => {
        console.log("ID de la lista que recibido en Home:", listaId);
        setListaSeleccionadaId(listaId);
    };

    // Abrir modal para gestionar listas
    const openGestionListaModal = () => {
        setSelectedSong(null);
        setModalType("gestionarListas");
    };

    // Abrir modal para agregar música a una lista
    const openAddMusicModal = (song) => {
        setSelectedSong(song);
        setModalType("addMusicList");
    };

    // Cerrar cualquier modal
    const closeModal = () => {
        setModalType(null);
        setSelectedSong(null);
    };

    // 🔹 FLUJO COMPLETO (LO MÁS IMPORTANTE)
    // 1. Home tiene el estado (modalType) → ES LA FUENTE DE LA VERDAD
    // 2. Se pasa openAddMusicModal a TopHeader (por props)
    // 3. El botón (nieto) ejecuta esa función
    // 4. Eso cambia el estado en Home
    // 5. React re-renderiza automáticamente
    // 6. AppModal recibe el nuevo valor: type="addMusic"
    // 7. AppModal decide: si hay type → se muestra, si no → no
    return (
        <section className="relative h-full w-full bg-gradient-to-b from-[#0d0d12] via-[#09090d] to-[#050507]">
            <div className="flex h-full w-full flex-col">

                {/* HEADER SUPERIOR */}
                <TopHeader
                    listas={listas}
                    usuarioPerfil={usuarioCompleto}
                    onLogout={onLogout}
                    listaSeleccionadaId={listaSeleccionadaId}
                    onSeleccionarLista={handleSeleccionarLista}
                    onOpenAddMusicModal={openGestionListaModal} />

                {/* CONTENIDO CENTRAL */}
                <div className="flex-1 overflow-hidden p-3 md:p-4">
                    <div className="grid h-full grid-cols-12 gap-3 md:gap-4">

                        <aside className="col-span-12 min-h-0 rounded-2xl border border-fuchsia-500/20 bg-[#0a0a0f] lg:col-span-4">
                            <PlaylistPanel
                                onSeleccionarCancion={handleSeleccionarCancion}
                                lista={listaSeleccionada}
                                cancionActivaId={cancionActiva?.id}
                                isPlaying={isPlaying}
                            />
                        </aside>

                        <section className="col-span-12 min-h-0 lg:col-span-3">
                            <NowPlayingPanel
                                cancion={cancionActiva}
                                isPlaying={isPlaying}
                            />
                        </section>

                        <aside className="col-span-12 flex flex-col gap-2 min-h-0 lg:col-span-5">
                            <CarouselGeneres />
                            <ExplorePanel />
                        </aside>
                    </div>
                </div>

                <footer className="h-[120px] w-full shrink-0 border-t border-white/10 px-3 py-3 md:h-[130px] md:px-4">
                    <PlayerBar />
                </footer>
            </div>

            {/* 🔹 Aquí se usa el estado */}
            {/* Si modalType = null → no se ve */}
            {/* Si modalType = "addMusic" → se muestra */}
            <AppModal
                type={modalType}
                selectedSong={selectedSong}
                onClose={closeModal} />
        </section>
    );
}