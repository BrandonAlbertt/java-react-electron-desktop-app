
// ===============================
// IMPORTS: LIBRERIAS Y COMPONENTES
// ===============================
import { useState, useMemo } from "react";
import PlayerBar from "../components/layout/PlayerBar";
import PlaylistPanel from "../components/music/PlaylistPanel";
import NowPlayingPanel from "../components/music/NowPlayingPanel";
import ExplorePanel from "../components/music/ExplorePanel";
import TopHeader from "../components/layout/TopHeader";
import CarouselGeneres from "../components/music/CarouselGeneres";
import AppModal from "../components/layout/AppModal";
import { useBiblioteca } from "../hooks/useBiblioteca";
import { useExplorar } from "../hooks/useExplorar";

export default function Home({ usuario, onLogout }) {
    // ===============================
    // ESTADOS PRINCIPALES: HOOKS Y DATOS GLOBALES
    // ===============================
    // datos de usuario y biblioteca, obtiene datos por usuarioId
    const usuarioId = usuario?.id;
    const {
        usuario: usuarioCompleto, // renombrado por conflicto de nombres
        listas,
        canciones,
        loading,
        error,
    } = useBiblioteca(usuarioId);

    // datos generales para explorar (generos, grupos, canciones)
    const {
        data: explorarData,
        loading: loadingExplorar,
        error: errorExplorar,
    } = useExplorar();

    // estado para el genero seleccionado
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    // estados de control de reproduccion y ui
    const [shuffleActivo, setShuffleActivo] = useState(false); // modo aleatorio
    const [repeatActivo, setRepeatActivo] = useState(false); // modo repetir
    const [historialShuffle, setHistorialShuffle] = useState([]); // historial de aleatorio
    const [cancionActiva, setCancionActiva] = useState(null); // cancion seleccionada
    const [isPlaying, setIsPlaying] = useState(false); // estado de reproduccion
    const [origenReproduccion, setOrigenReproduccion] = useState(null); // origen de la cancion
    const [colaReproduccion, setColaReproduccion] = useState([]); // guarda la cola/lista de rerproduccion actual para navegacion
    const [listaSeleccionadaId, setListaSeleccionadaId] = useState(null); // lista seleccionada
    const [modalType, setModalType] = useState(null); // tipo de modal
    const [selectedSong, setSelectedSong] = useState(null); // cancion para el modal

    // ===============================
    // MEMOS DERIVADOS: CALCULOS MEMORIZADOS
    // ===============================
    // obtiene la lista seleccionada a partir del id
    const listaSeleccionada = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
    }, [listas, listaSeleccionadaId]);

    // ===============================
    // HANDLERS Y FUNCIONES DE UI: AGRUPADOS POR PROPOSITO
    // ===============================

    // selecciona una lista
    const handleSeleccionarLista = (listaId) => {
        console.log("ID de la lista que recibido en Home:", listaId);
        setListaSeleccionadaId(listaId);
    };

    // abre modal para gestionar listas
    const openGestionListaModal = () => {
        setSelectedSong(null);
        setModalType("gestionarListas");
    };

    // abre modal para agregar musica a lista
    const openAddMusicModal = (song) => {
        setSelectedSong(song);
        setModalType("addMusicList");
    };

    // cierra cualquier modal
    const closeModal = () => {
        setModalType(null);
        setSelectedSong(null);
    };


    // ===============================
    // REPRODUCIR CANCIÓN GLOBAL
    // ===============================
    // recibe canción, origen y lista desde donde se reproducirá
    const reproducirCancion = (song, origen = "desconocido", cola = []) => {
        const esMismaCancion =
            cancionActiva?.id === song.id &&
            origen === origenReproduccion;

        if (esMismaCancion) {
            setColaReproduccion(cola);
            setIsPlaying((prev) => !prev);
            return;
        }

        setOrigenReproduccion(origen);
        setColaReproduccion(cola);
        setHistorialShuffle([]);
        setCancionActiva(song);
        setIsPlaying(true);
    };

    // ===============================
    // SIGUIENTE CANCIÓN
    // ===============================
    // avanza según la cola actual: playlist o explore
    const handleSiguienteCancion = () => {
        const listaActual = colaReproduccion;

        if (!listaActual.length) return;

        // si la lista solo tiene una canción, la reproduce de nuevo
        if (listaActual.length === 1) {
            setIsPlaying(true);
            return;
        }


        if (shuffleActivo) {
            const cancionesDisponibles = listaActual.filter(
                (song) =>
                    song.id !== cancionActiva?.id &&
                    !historialShuffle.includes(song.id)
            );

            if (cancionesDisponibles.length === 0) {
                setHistorialShuffle([]);

                const reinicio = listaActual.filter(
                    (song) => song.id !== cancionActiva?.id
                );

                if (reinicio.length === 0) return;

                const randomSong =
                    reinicio[Math.floor(Math.random() * reinicio.length)];

                setHistorialShuffle([randomSong.id]);

                reproducirCancion(
                    randomSong,
                    origenReproduccion,
                    listaActual
                );

                return;
            }

            const randomSong =
                cancionesDisponibles[
                Math.floor(Math.random() * cancionesDisponibles.length)
                ];

            setHistorialShuffle((prev) => [...prev, randomSong.id]);

            reproducirCancion(
                randomSong,
                origenReproduccion,
                listaActual
            );

            return;
        }

        const indexActual = listaActual.findIndex(
            (song) => song.id === cancionActiva?.id
        );

        const siguienteIndex =
            indexActual === -1 || indexActual === listaActual.length - 1
                ? 0
                : indexActual + 1;

        reproducirCancion(
            listaActual[siguienteIndex],
            origenReproduccion,
            listaActual
        );
    };

    // ===============================
    // CANCIÓN ANTERIOR
    // ===============================
    // retrocede según la cola actual: playlist o explore
    const handleAnteriorCancion = () => {
        const listaActual = colaReproduccion;

        if (!listaActual.length) return;

        if (listaActual.length === 1) {
            setIsPlaying(true);
            return;
        }

        const indexActual = listaActual.findIndex(
            (song) => song.id === cancionActiva?.id
        );

        const anteriorIndex =
            indexActual <= 0
                ? listaActual.length - 1
                : indexActual - 1;

        reproducirCancion(
            listaActual[anteriorIndex],
            origenReproduccion,
            listaActual
        );
    };

    // alterna modo aleatorio
    const handleToggleShuffle = () => {
        setShuffleActivo((prev) => !prev);
        setHistorialShuffle([]);
    };

    // alterna modo repetir
    const handleToggleRepeat = () => {
        setRepeatActivo((prev) => !prev);
    };

    // ===============================
    // FUNCIONES DE EXPLORE PANEL
    // ===============================
    // filtra canciones segun genero seleccionado
    const cancionesFiltradasPorGenero = useMemo(() => {
        if (!generoSeleccionado) return explorarData?.canciones || [];

        return (explorarData?.canciones || []).filter((cancion) =>
            cancion.generos.includes(generoSeleccionado.nombre)
        );
    }, [explorarData?.canciones, generoSeleccionado]);

    // filtra grupos segun canciones del genero
    const gruposFiltradosPorGenero = useMemo(() => {
        if (!generoSeleccionado) return explorarData?.grupos || [];

        const nombres = cancionesFiltradasPorGenero.map((cancion) => cancion.grupo);

        return (explorarData?.grupos || []).filter((grupo) =>
            nombres.includes(grupo.nombre)
        );
    }, [explorarData?.grupos, cancionesFiltradasPorGenero, generoSeleccionado]);

    // ===============================
    // RENDER: ESTRUCTURA VISUAL DE LA PAGINA PRINCIPAL
    // ===============================
    // renderiza la vista principal y distribuye handlers
    return (
        <section className="relative h-full w-full bg-gradient-to-b from-[#0d0d12] via-[#09090d] to-[#050507]">
            <div className="flex h-full w-full flex-col">
                {/* renderiza header superior */}
                <TopHeader
                    listas={listas}
                    usuarioPerfil={usuarioCompleto}
                    onLogout={onLogout}
                    listaSeleccionadaId={listaSeleccionadaId}
                    onSeleccionarLista={handleSeleccionarLista}
                    onOpenAddMusicModal={openGestionListaModal}
                />

                {/* renderiza contenido central */}
                <div className="flex-1 overflow-hidden p-3 md:p-4">
                    <div className="grid h-full grid-cols-12 gap-3 md:gap-4">
                        <aside className="col-span-12 min-h-0 rounded-2xl border border-fuchsia-500/20 bg-[#0a0a0f] lg:col-span-4">
                            <PlaylistPanel
                                onSeleccionarCancion={(song) =>
                                    reproducirCancion(song, "PlaylistPanel", listaSeleccionada?.canciones || [])
                                }
                                lista={listaSeleccionada}
                                cancionActivaId={cancionActiva?.id}
                                isPlaying={isPlaying}
                                origenReproduccion={origenReproduccion}
                            />
                        </aside>

                        <section className="col-span-12 min-h-0 lg:col-span-3">
                            <NowPlayingPanel cancion={cancionActiva} isPlaying={isPlaying} />
                        </section>

                        <aside className="col-span-12 flex min-h-0 flex-col gap-2 lg:col-span-5">
                            <CarouselGeneres
                                generos={explorarData?.generos || []}
                                generoSeleccionadoId={generoSeleccionado?.id}
                                onSeleccionarGenero={setGeneroSeleccionado}
                            />
                            <ExplorePanel
                                grupos={gruposFiltradosPorGenero}
                                canciones={cancionesFiltradasPorGenero}
                                loading={loadingExplorar}
                                error={errorExplorar}
                                generoSeleccionado={generoSeleccionado}
                                onSeleccionarCancion={(song, colaExplore) =>
                                    reproducirCancion(song, "ExplorePanel", colaExplore)
                                }
                                cancionActivaId={cancionActiva?.id}
                                isPlaying={isPlaying}
                                origenReproduccion={origenReproduccion}
                            />
                        </aside>
                    </div>
                </div>

                {/* renderiza barra inferior de reproduccion */}
                <footer className="h-[120px] w-full shrink-0 border-t border-white/10 px-3 py-3 md:h-[130px] md:px-4">
                    <PlayerBar
                        cancion={cancionActiva}
                        isPlaying={isPlaying}
                        onTogglePlay={() => setIsPlaying((prev) => !prev)}
                        onNext={handleSiguienteCancion}
                        onPrev={handleAnteriorCancion}
                        shuffleActivo={shuffleActivo}
                        repeatActivo={repeatActivo}
                        onToggleShuffle={handleToggleShuffle}
                        onToggleRepeat={handleToggleRepeat}
                        onSongEnded={() => {
                            // renderiza repeticion o siguiente cancion al terminar
                            if (repeatActivo) {
                                setIsPlaying(false);
                                setTimeout(() => setIsPlaying(true), 0);
                                return;
                            }
                            handleSiguienteCancion();
                        }}
                    />
                </footer>
            </div>

            {/* renderiza modal de gestion y agregado */}
            <AppModal type={modalType} selectedSong={selectedSong} onClose={closeModal} />
        </section>
    );
}