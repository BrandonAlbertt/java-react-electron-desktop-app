import { useEffect, useMemo, useRef, useState } from "react";
import { musicGroups } from "../../data/musicData";
import GroupCard from "./GroupCard";
import ExploreSongItem from "./ExploreSongItem";

/*
    Guia corta para entender este archivo (nivel principiante):
    - ExplorePanel es un componente padre: muestra buscador, pestañas y cambia entre lista de grupos o canciones.
    - Home usa este componente y no le pasa props directas; ExplorePanel maneja su propio estado interno.
    - Usa componentes reutilizables como GroupCard y ExploreSongItem para renderizar tarjetas de grupos y filas de canciones.
    - Flujo de eventos: los clicks en grupo, play y favorito ejecutan callbacks locales que actualizan estado y vuelven a pintar la vista.
    - Estilo especial no estandar: usa gradientes personalizados y clases arbitrarias para ocultar la barra de scroll.
*/

export default function ExplorePanel() {
    // Estado local de la vista
    const [activeTab, setActiveTab] = useState("groups");
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState(musicGroups);
    const [playingSongId, setPlayingSongId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Referencias para scroll
    const groupsScrollRef = useRef(null);
    const songsScrollRef = useRef(null);

    // Estado para mostrar u ocultar la flecha inferior
    const [showBottomArrow, setShowBottomArrow] = useState(false);

    // Datos derivados para la pestaña de grupos
    const filteredGroups = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return groups;

        return groups.filter((group) =>
            group.name.toLowerCase().includes(term)
        );
    }, [search, groups]);

    // Datos derivados para la pestaña de canciones
    const songsToShow = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (selectedGroup) {
            return selectedGroup.songs.filter(
                (song) =>
                    song.title.toLowerCase().includes(term) ||
                    selectedGroup.name.toLowerCase().includes(term)
            );
        }

        const allSongs = groups.flatMap((group) =>
            group.songs.map((song) => ({
                ...song,
                groupId: group.id,
                groupName: group.name,
                groupImage: group.image,
            }))
        );

        if (!term) return allSongs;

        return allSongs.filter(
            (song) =>
                song.title.toLowerCase().includes(term) ||
                song.groupName.toLowerCase().includes(term)
        );
    }, [search, selectedGroup, groups]);

    // Handlers de interacción
    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setActiveTab("songs");
        setSearch("");
    };

    const handleToggleFavorite = (songId) => {
        const updatedGroups = groups.map((group) => ({
            ...group,
            songs: group.songs.map((song) =>
                song.id === songId
                    ? { ...song, isFavorite: !song.isFavorite }
                    : song
            ),
        }));

        setGroups(updatedGroups);

        if (selectedGroup) {
            const updatedSelected = updatedGroups.find(
                (g) => g.id === selectedGroup.id
            );
            setSelectedGroup(updatedSelected);
        }
    };

    const handlePlay = (song) => {
        if (playingSongId === song.id) {
            setIsPlaying((prev) => !prev);
        } else {
            setPlayingSongId(song.id);
            setIsPlaying(true);
        }

        console.log("Reproducir canción:", song);
    };

    // Devuelve la referencia activa según la pestaña actual
    const getCurrentScrollRef = () => {
        return activeTab === "groups"
            ? groupsScrollRef.current
            : songsScrollRef.current;
    };

    // Verifica si aún hay contenido abajo
    const checkScrollState = () => {
        const el = getCurrentScrollRef();
        if (!el) return;

        const hasMoreBelow =
            el.scrollTop + el.clientHeight < el.scrollHeight - 8;

        setShowBottomArrow(hasMoreBelow);
    };

    // Baja el contenido suavemente
    const handleScrollDown = () => {
        const currentRef = getCurrentScrollRef();

        if (currentRef) {
            currentRef.scrollBy({
                top: 250,
                behavior: "smooth",
            });
        }
    };

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
    }, [activeTab, selectedGroup, search, groups]);

    // Estado visual auxiliar
    const showBackToGroups = activeTab === "songs" && selectedGroup;

    return (
        <section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-white/10 bg-[#07070b] p-4 text-white">
            {/* Buscador */}
            <div className="mb-4 shrink-0">
                <div className="flex h-14 items-center rounded-full border border-white/10 bg-white/5 px-5">
                    <span className="mr-3 text-2xl text-white/55">⌕</span>
                    <input
                        type="text"
                        placeholder="Buscar canción o grupo"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-full w-full bg-transparent text-lg text-white outline-none placeholder:text-white/40"
                    />
                </div>
            </div>

            {/* Pestañas para cambiar entre vista de grupos y vista de canciones */}
            <div className="mb-4 shrink-0">
                <div className="flex rounded-2xl bg-[#121217] p-1">
                    <button
                        onClick={() => {
                            setActiveTab("groups");
                            setSelectedGroup(null);
                        }}
                        className={`flex-1 rounded-xl px-4 py-3 text-lg transition ${
                            activeTab === "groups"
                                ? "bg-black text-white shadow-[inset_0_-2px_0_rgba(168,85,247,1)]"
                                : "text-white/55 hover:text-white"
                        }`}
                    >
                        Grupos
                    </button>

                    <button
                        onClick={() => setActiveTab("songs")}
                        className={`flex-1 rounded-xl px-4 py-3 text-lg transition ${
                            activeTab === "songs"
                                ? "bg-black text-white shadow-[inset_0_-2px_0_rgba(168,85,247,1)]"
                                : "text-white/55 hover:text-white"
                        }`}
                    >
                        Canciones
                    </button>
                </div>
            </div>

            {/* Texto de contexto cuando hay un grupo filtrado */}
            {showBackToGroups && (
                <div className="mb-3 flex items-center justify-between px-1">
                    <p className="text-sm text-fuchsia-400">
                        Grupo seleccionado:{" "}
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

            {/* Contenido principal: este panel cambia entre grupos y canciones */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem] bg-black p-5">
                {activeTab === "groups" ? (
                    <>
                        {/* Grid de grupos: cambia md:grid-cols-3 por md:grid-cols-4 o md:grid-cols-5 para agregar columnas */}
                        <div
                            ref={groupsScrollRef}
                            className="grid h-full grid-cols-2 gap-x-6 gap-y-8 overflow-y-auto pr-0 md:grid-cols-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                        {/* Contenedor de canciones: fondo heredado bg-black del padre */}
                        {/* Lista vertical de canciones filtradas */}
                        <div className="space-y-2">
                            {songsToShow.map((song) => (
                                <ExploreSongItem
                                    key={song.id}
                                    song={song}
                                    isActive={playingSongId === song.id}
                                    isPlaying={playingSongId === song.id && isPlaying}
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
                                    onPlay={handlePlay}
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

                {/* Difuminado inferior para suavizar el corte del scroll */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent" />

                {/* Flecha flotante: aparece cuando hay mas contenido hacia abajo */}
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