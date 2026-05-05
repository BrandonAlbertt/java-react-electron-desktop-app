
// ===============================
// IMPORTACIONES
// ===============================
import { useEffect, useMemo, useRef, useState } from "react";
import GroupCard from "./GroupCard";
import ExploreSongItem from "./ExploreSongItem";
import { normalizeSong } from "../../utils/normalizeSong";

/*
    Guia corta para entender este archivo (nivel principiante):
    - ExplorePanel es un componente padre: muestra buscador, pestañas y cambia entre lista de grupos o canciones.
    - Home usa este componente y no le pasa props directas; ExplorePanel maneja su propio estado interno.
    - Usa componentes reutilizables como GroupCard y ExploreSongItem para renderizar tarjetas de grupos y filas de canciones.
    - Flujo de eventos: los clicks en grupo, play y favorito ejecutan callbacks locales que actualizan estado y vuelven a pintar la vista.
    - Estilo especial no estandar: usa gradientes personalizados y clases arbitrarias para ocultar la barra de scroll.
*/


// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function ExplorePanel({
    grupos,
    canciones,
    loading,
    error,
    generoSeleccionado,
    onSeleccionarCancion,
    cancionActivaId,
    isPlaying,
    origenReproduccion
}) {

    // ===============================
    // ESTADOS Y REFERENCIAS PRINCIPALES
    // ===============================
    // estados locales para la vista y reproducción
    const [activeTab, setActiveTab] = useState("groups");
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    // referencias para scroll de grupos y canciones
    const groupsScrollRef = useRef(null);
    const songsScrollRef = useRef(null);

    // estado para mostrar/ocultar la flecha inferior
    const [showBottomArrow, setShowBottomArrow] = useState(false);

    // ===============================
    // DATOS DERIVADOS Y MEMOIZADOS
    // ===============================
    // transforma los datos de grupos recibidos
    const groups = useMemo(() => {
        return (grupos || []).map((grupo) => ({
            id: grupo.id,
            name: grupo.nombre,
            image: grupo.imagen_url,
        }));
    }, [grupos]);

    // ===============================
    // DATOS DERIVADOS Y MEMOIZADOS
    // ===============================
    // transforma las canciones y agrega imagen del grupo
    const songs = useMemo(() => {
        return (canciones || []).map((cancion) => normalizeSong(cancion, grupos));
    }, [canciones, grupos]);

    // filtra grupos según búsqueda
    const filteredGroups = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return groups;
        return groups.filter((group) =>
            group.name.toLowerCase().includes(term)
        );
    }, [search, groups]);

    const songsToShow = useMemo(() => {
        const term = search.trim().toLowerCase();

        let result = songs;

        if (selectedGroup) {
            result = result.filter(
                (song) => song.grupo === selectedGroup.name
            );
        }

        if (!term) return result;

        return result.filter(
            (song) =>
                song.titulo.toLowerCase().includes(term) ||
                song.grupo.toLowerCase().includes(term)
        );
    }, [search, selectedGroup, songs]);

    // ===============================
    // HANDLERS Y EVENTOS DE USUARIO
    // ===============================
    // al hacer click en un grupo
    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setActiveTab("songs");
        setSearch("");
    };

    // al marcar/desmarcar favorito
    const handleToggleFavorite = (songId) => {
        console.log("Agregar/quitar favorito:", songId);
    };

    // ===============================
    // HANDLER: REPRODUCIR CANCIÓN
    // ===============================
    // envía al home la canción y la cola visible actual
    const handleSeleccionarCancion = (cancion) => {
        onSeleccionarCancion?.(cancion, songsToShow);
    };

    // ===============================
    // FUNCIONES AUXILIARES DE SCROLL
    // ===============================
    // obtiene la referencia activa según la pestaña
    const getCurrentScrollRef = () => {
        return activeTab === "groups"
            ? groupsScrollRef.current
            : songsScrollRef.current;
    };

    // verifica si hay contenido abajo para mostrar flecha
    const checkScrollState = () => {
        const el = getCurrentScrollRef();
        if (!el) return;
        const hasMoreBelow =
            el.scrollTop + el.clientHeight < el.scrollHeight - 8;
        setShowBottomArrow(hasMoreBelow);
    };

    // baja el contenido suavemente al hacer click en la flecha
    const handleScrollDown = () => {
        const currentRef = getCurrentScrollRef();
        if (currentRef) {
            currentRef.scrollBy({
                top: 250,
                behavior: "smooth",
            });
        }
    };

    // ===============================
    // EFECTOS SECUNDARIOS (USEEFFECT)
    // ===============================
    // controla el scroll y la flecha al cambiar pestaña, grupo o búsqueda
    useEffect(() => {
        const el = getCurrentScrollRef();
        if (!el) return;
        checkScrollState();
        el.addEventListener("scroll", checkScrollState);
        window.addEventListener("resize", checkScrollState);
        return () => {
            el.removeEventListener("scroll", checkScrollState);
            window.removeEventListener("resize", checkScrollState);
        };
    }, [activeTab, selectedGroup, search, groups, songsToShow]);

    // ===============================
    // ESTADO VISUAL AUXILIAR
    // ===============================
    // muestra el texto de grupo seleccionado
    const showBackToGroups = activeTab === "songs" && selectedGroup;


    // ===============================
    // RENDERIZADO PRINCIPAL
    // ===============================
    // muestra loading o error si corresponde
    if (loading) {
        return (
            <section className="flex h-full min-h-0 w-full items-center justify-center rounded-[1.7rem] border border-white/10 bg-[#07070b] p-3 text-sm text-white/50">
                Cargando exploración...
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex h-full min-h-0 w-full items-center justify-center rounded-[1.7rem] border border-red-500/20 bg-[#07070b] p-3 text-sm text-red-300">
                {error}
            </section>
        );
    }


    return (
        <section className="flex h-full min-h-0 w-full flex-col rounded-[1.7rem] border border-white/10 bg-[#07070b] p-3 text-white">
            {/* =============================== */}
            {/* BUSCADOR */}
            {/* =============================== */}
            <div className="mb-2 shrink-0">
                <div className="flex h-10 items-center rounded-full border border-white/10 bg-white/[0.04] px-4">
                    <span className="mr-2 text-base text-white/45">⌕</span>
                    <input
                        type="text"
                        placeholder="Buscar canción o grupo"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                </div>
            </div>

            {/* =============================== */}
            {/* PESTAÑAS DE VISTA (GRUPOS / CANCIONES) */}
            {/* =============================== */}
            <div className="mb-2 shrink-0">
                <div className="flex rounded-full border border-white/5 bg-white/[0.035] p-1">
                    <button
                        onClick={() => {
                            setActiveTab("groups");
                            setSelectedGroup(null);
                        }}
                        className={`flex-1 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ${
                            activeTab === "groups"
                                ? "bg-black/80 text-white shadow-[0_0_12px_rgba(168,85,247,0.25),inset_0_-1px_0_rgba(217,70,239,0.8)]"
                                : "text-white/45 hover:text-white/80"
                        }`}
                    >
                        Grupos
                    </button>
                    <button
                        onClick={() => setActiveTab("songs")}
                        className={`flex-1 rounded-full px-3 py-1.5 text-sm transition-all duration-300 ${
                            activeTab === "songs"
                                ? "bg-black/80 text-white shadow-[0_0_12px_rgba(168,85,247,0.25),inset_0_-1px_0_rgba(217,70,239,0.8)]"
                                : "text-white/45 hover:text-white/80"
                        }`}
                    >
                        Canciones
                    </button>
                </div>
            </div>

            {/* =============================== */}
            {/* TEXTO DE GRUPO SELECCIONADO */}
            {/* =============================== */}
            {showBackToGroups && (
                <div className="mb-3 flex items-center justify-between px-1">
                    <p className="text-sm text-fuchsia-400">
                        Grupo seleccionado: {" "}
                        <span className="font-semibold">
                            {selectedGroup.name}
                        </span>
                    </p>
                    <button
                        onClick={() => {
                            setSelectedGroup(null);
                            setActiveTab("groups");
                        }}
                        className="text-sm text-white/70 transition hover:text-white"
                    >
                        Ver todos los grupos
                    </button>
                </div>
            )}

            {/* =============================== */}
            {/* PANEL PRINCIPAL: GRUPOS O CANCIONES */}
            {/* =============================== */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem] bg-black p-4">
                {activeTab === "groups" ? (
                    <>
                        {/* grid de grupos */}
                        <div
                            ref={groupsScrollRef}
                            className="grid h-full auto-rows-[9rem] grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {filteredGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    onClick={handleGroupClick}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div
                        ref={songsScrollRef}
                        className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {/* lista vertical de canciones filtradas */}
                        <div className="space-y-2">
                            {songsToShow.map((song) => (
                                <ExploreSongItem
                                    key={song.id}
                                    song={song}
                                    isActive={song.id === cancionActivaId && origenReproduccion === "ExplorePanel"}
                                    isPlaying={
                                        song.id === cancionActivaId &&
                                        origenReproduccion === "ExplorePanel" &&
                                        isPlaying
                                    }
                                    groupImage={
                                        selectedGroup
                                            ? selectedGroup.image
                                            : song.groupImage
                                    }
                                    groupName={
                                        selectedGroup
                                            ? selectedGroup.name
                                            : song.groupName
                                    }
                                    onSeleccionarCancion={handleSeleccionarCancion}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                            {songsToShow.length === 0 && (
                                <div className="flex h-full items-center justify-center py-10 text-white/45">
                                    No se encontraron resultados.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* =============================== */}
                {/* DIFUMINADO Y FLECHA INFERIOR */}
                {/* =============================== */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent" />
                {showBottomArrow && (
                    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
                        <button
                            onClick={handleScrollDown}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/30 bg-black/55 backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-fuchsia-400/50"
                            title="Ver más"
                        >
                            <span className="text-[2rem] leading-none text-violet-400 transition group-hover:text-fuchsia-300">
                                ▽
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

/*
        Uso rapido en un componente padre:

        import ExplorePanel from "../components/music/ExplorePanel";

        <aside className="col-span-12 min-h-0 lg:col-span-5">
            <ExplorePanel />
        </aside>

        Condiciones minimas:
        - El contenedor padre debe tener altura disponible (ejemplo: min-h-0 y un layout con h-full)
        - Debe existir un estilo base para la animacion marquee (animate-marquee-x) en CSS global
        - musicGroups debe incluir grupos con songs (id, title, duration, isFavorite, image)
*/