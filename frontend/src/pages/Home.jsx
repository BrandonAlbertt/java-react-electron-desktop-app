// ===============================
// IMPORTACIONES
// ===============================
import { useMemo, useState } from "react";
import AppModal from "../components/layout/AppModal";
import PlayerBar from "/src/components/layout/PlayerBar.jsx";
import TopHeader from "../components/layout/TopHeader";
import CarouselGeneres from "../components/music/CarouselGeneres";
import ExplorePanel from "../components/music/ExplorePanel";
import NowPlayingPanel from "../components/music/NowPlayingPanel";
import PlaylistPanel from "../components/music/PlaylistPanel";
import ModalFavoritos from "../components/modals/ModalFavoritos";
import ModalPlaylist from "../components/modals/ModalPlaylist";
import { useBiblioteca } from "../hooks/useBiblioteca";
import { useExplorar } from "../hooks/useExplorar";
import { useListas } from "../hooks/useListas";
import { useMusica } from "../hooks/useMusica";
import { useGrupos } from "../hooks/useGrupos";

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function Home({ usuario, onLogout }) {
    // ===============================
    // HOOKS Y DATOS GLOBALES
    // ===============================
    const usuarioId = usuario?.id;

    // carga usuario y biblioteca del usuario activo
    const {
        usuario: usuarioCompleto,
        listas,
        recargarBiblioteca,
        setListas,
    } = useBiblioteca(usuarioId);

    // expone acciones para listas sin cambiar el flujo actual
    const {
        crearLista,
        agregarCancion,
        quitarCancion,
        borrarLista,
        actualizarNombreLista,
    } = useListas();

    // carga canciones, grupos y generos para Explore
    const {
        data: explorarData,
        loading: loadingExplorar,
        error: errorExplorar,
    } = useExplorar();

    // expone la funcion que esta eh hook useMusica que guarda la musica guardarMusica
    const { guardarMusica } = useMusica();
    // expone la funcion que esta en el hook useGrupos que guarda el grupo guardarGrupo
    const { guardarGrupo } = useGrupos();

    //console.log("Home - explorarData.grupos:", explorarData?.grupos);

    // ===============================
    // ESTADOS Y REFERENCIAS
    // ===============================
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
    const [shuffleActivo, setShuffleActivo] = useState(false);
    const [repeatActivo, setRepeatActivo] = useState(false);
    const [historialShuffle, setHistorialShuffle] = useState([]);
    const [cancionActiva, setCancionActiva] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [origenReproduccion, setOrigenReproduccion] = useState(null);
    const [colaReproduccion, setColaReproduccion] = useState([]);
    const [listaSeleccionadaId, setListaSeleccionadaId] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const [modalFavoritosKey, setModalFavoritosKey] = useState(0);

    // ===============================
    // DATOS DERIVADOS Y MEMOS
    // ===============================
    // busca la lista seleccionada usando el id guardado en Home
    const listaSeleccionada = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
    }, [listas, listaSeleccionadaId]);

    // filtra canciones segun el genero activo
    const cancionesFiltradasPorGenero = useMemo(() => {
        if (!generoSeleccionado) return explorarData?.canciones || [];

        return (explorarData?.canciones || []).filter((cancion) =>
            cancion.generos.includes(generoSeleccionado.nombre)
        );
    }, [explorarData?.canciones, generoSeleccionado]);

    // filtra grupos usando las canciones del genero seleccionado
    const gruposFiltradosPorGenero = useMemo(() => {
        if (!generoSeleccionado) return explorarData?.grupos || [];

        const nombres = cancionesFiltradasPorGenero.map((cancion) => cancion.grupo);

        return (explorarData?.grupos || []).filter((grupo) =>
            nombres.includes(grupo.nombre)
        );
    }, [explorarData?.grupos, cancionesFiltradasPorGenero, generoSeleccionado]);

    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    // guarda la lista elegida para usarla en Playlist y Explore
    const handleSeleccionarLista = (listaId) => {
        console.log("ID de la lista que recibido en Home:", listaId);
        setListaSeleccionadaId(listaId);
    };

    // abre el modal de listas generales o el modal de musica
    const handleAbrirGestionListas = (origen = "desconocido") => {
        if (origen === "TopHeader") {
            setSelectedSong(null);
            setModalType("gestionLista");
            return;
        }

        if (origen === "PlaylistPanel") {
            setModalType("gestionMusica");
            setSelectedSong(null);
        }
    };

    // SongItem, ExploreSongItem y PlayerBar envian la cancion a Home
    const handleAbrirModalFavoritos = (song) => {
        if (!song) return;

        setSelectedSong(song);
        setModalFavoritosKey((prev) => prev + 1);
        setModalType("addMusicList");
    };

    // aplica al backend los cambios marcados en ModalFavoritos
    const handleGuardarCambiosFavoritos = async ({
        listasAgregar = [],
        listasQuitar = [],
        song,
    }) => {
        if (!song?.id) return null;

        await Promise.all([
            ...listasAgregar.map((listaId) => agregarCancion(listaId, song.id)),
            ...listasQuitar.map((listaId) => quitarCancion(listaId, song.id)),
        ]);

        await recargarBiblioteca?.();
        return true;
    };

    // renombra una lista usando el hook useListas y actualiza el estado local
    const handleRenombrarListaFavoritos = async (listaId, nuevoNombre) => {
        // primero actualiza en la API y en el hook useListas
        const resultado = await actualizarNombreLista(listaId, nuevoNombre);
        
        // luego actualiza también el estado de listas que viene de useBiblioteca para que se vea en el render
        if (resultado) {
            setListas((prev) =>
                prev.map((lista) =>
                    lista.id === listaId
                        ? { ...lista, nombre: nuevoNombre }
                        : lista
                )
            );
        }
        
        return resultado;
    };

    // crea una lista nueva usando la portada de la cancion actual
    const handleCrearListaFavoritos = async (nombreLista, song) => {
        const nombre = nombreLista?.trim();
        if (!usuarioId || !nombre) return null;

        const urlImagen =
            song?.imagen_grupo || song?.imagen || song?.imagen_url || song?.groupImage || null;

        const data = await crearLista(usuarioId, nombre, urlImagen);
        const listaCreada = data?.lista || data;

        if (listaCreada?.id) {
            setListas((prev) => [
                ...prev,
                {
                    ...listaCreada,
                    imagen: listaCreada.imagen || listaCreada.url_imagen || urlImagen,
                    canciones: listaCreada.canciones || [],
                },
            ]);
        }

        return data;
    };

    // elimina una lista y limpia la seleccion si era la activa
    const handleEliminarListaFavoritos = async (listaId) => {
        if (!listaId) return null;

        const data = await borrarLista(listaId);
        setListas((prev) => prev.filter((lista) => lista.id !== listaId));

        if (listaSeleccionadaId === listaId) {
            setListaSeleccionadaId(null);
        }

        return data;
    };

    // cierra cualquier modal abierto
    const handleCerrarModal = () => {
        setModalType(null);
        setSelectedSong(null);
    };

    // recibe la cancion, el origen y la cola actual
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

    // avanza segun la cola actual: playlist o explore
    const handleSiguienteCancion = () => {
        const listaActual = colaReproduccion;

        if (!listaActual.length) return;

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

    // retrocede segun la cola actual
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

    // activa o desactiva el modo aleatorio
    const handleToggleShuffle = () => {
        setShuffleActivo((prev) => !prev);
        setHistorialShuffle([]);
    };

    // activa o desactiva repetir
    const handleToggleRepeat = () => {
        setRepeatActivo((prev) => !prev);
    };

 

    //console.log("listas de grupos en Home:", explorarData?.grupos);
    // ===============================
    // RENDER PRINCIPAL
    // ===============================
    return (
        <section className="relative h-full w-full bg-linear-to-b from-[#0d0d12] via-[#09090d] to-[#050507]">
            <div className="flex h-full w-full flex-col">
                <TopHeader
                    listas={listas}
                    usuarioPerfil={usuarioCompleto}
                    onLogout={onLogout}
                    listaSeleccionadaId={listaSeleccionadaId}
                    onSeleccionarLista={handleSeleccionarLista}
                    onAbrirGestionListas={() => handleAbrirGestionListas("TopHeader")}
                />

                <div className="flex-1 overflow-hidden p-3 md:p-4">
                    <div className="grid h-full grid-cols-12 gap-3 md:gap-4">
                        <aside className="col-span-12 min-h-0 rounded-2xl border border-fuchsia-500/20 bg-[#0a0a0f] lg:col-span-4">
                            <PlaylistPanel
                                onSeleccionarCancion={(cancion) =>
                                    reproducirCancion(
                                        cancion,
                                        "PlaylistPanel",
                                        listaSeleccionada?.canciones || []
                                    )
                                }
                                lista={listaSeleccionada}
                                cancionActivaId={cancionActiva?.id}
                                isPlaying={isPlaying}
                                origenReproduccion={origenReproduccion}
                                onAbrirGestionListas={() => handleAbrirGestionListas("PlaylistPanel")}
                                onAbrirModalFavoritos={handleAbrirModalFavoritos}
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
                                onSeleccionarCancion={(cancion, colaExplore) =>
                                    reproducirCancion(cancion, "ExplorePanel", colaExplore)
                                }
                                cancionActivaId={cancionActiva?.id}
                                isPlaying={isPlaying}
                                origenReproduccion={origenReproduccion}
                                onAbrirModalFavoritos={handleAbrirModalFavoritos}
                                listaSeleccionada={listaSeleccionada}
                            />
                        </aside>
                    </div>
                </div>

                <footer className="h-30 w-full shrink-0 border-t border-white/10 px-3 py-3 md:h-32.5 md:px-4">
                    <PlayerBar
                        cancion={cancionActiva}
                        isPlaying={isPlaying}
                        onAlternarReproduccion={() => setIsPlaying((prev) => !prev)}
                        onSiguienteCancion={handleSiguienteCancion}
                        onAnteriorCancion={handleAnteriorCancion}
                        shuffleActivo={shuffleActivo}
                        repeatActivo={repeatActivo}
                        onAlternarShuffle={handleToggleShuffle}
                        onAlternarRepeat={handleToggleRepeat}
                        onFinalizarCancion={() => {
                            if (repeatActivo) {
                                setIsPlaying(false);
                                setTimeout(() => setIsPlaying(true), 0);
                                return;
                            }

                            handleSiguienteCancion();
                        }}
                        onAbrirModalFavoritos={handleAbrirModalFavoritos}
                    />
                </footer>
            </div>

            <ModalFavoritos
                key={modalFavoritosKey}
                isOpen={modalType === "addMusicList"}
                onClose={handleCerrarModal}
                listas={listas}
                selectedSong={selectedSong}
                onGuardarCambios={handleGuardarCambiosFavoritos}
                onCrearLista={handleCrearListaFavoritos}
                onEliminarLista={handleEliminarListaFavoritos}
            />

            <ModalPlaylist
                isOpen={modalType === "gestionLista"}
                onClose={handleCerrarModal}
                listas={listas}
                onRenombrarLista={handleRenombrarListaFavoritos}
                onEliminarLista={handleEliminarListaFavoritos}
                grupos={explorarData?.grupos || []}
                generos={explorarData?.generos || []}
                onGuardarMusica={guardarMusica}
                onGuardarGrupo={guardarGrupo}
            />
        </section>
    );
}
