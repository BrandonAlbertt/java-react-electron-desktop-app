// ===============================
// IMPORTACIONES
// ===============================
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { normalizeSong } from "../../utils/normalizeSong";
import ExploreSongItem from "./ExploreSongItem";
import GroupCard from "./GroupCard";

/*
  ExplorePanel es el contenedor principal de la columna Explore.
  Muestra grupos y canciones, y envia eventos hacia Home sin cambiar el flujo actual.
*/

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function ExplorePanel({
    grupos,
    canciones,
    loading,
    error,
    onSeleccionarCancion,
    cancionActivaId,
    isPlaying,
    origenReproduccion,
    onAbrirModalFavoritos,
    listaSeleccionada,
}) {
    // ===============================
    // ESTADOS Y REFERENCIAS
    // ===============================
    const [activeTab, setActiveTab] = useState("groups");
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    const groupsScrollRef = useRef(null);
    const songsScrollRef = useRef(null);
    const [showBottomArrow, setShowBottomArrow] = useState(false);

    // ===============================
    // DATOS DERIVADOS Y MEMOS
    // ===============================
    // adapta la estructura de grupos para la vista
    const groups = useMemo(() => {
        return (grupos || []).map((grupo) => ({
            id: grupo.id,
            name: grupo.nombre,
            image: grupo.imagen_url,
        }));
    }, [grupos]);

    // adapta las canciones sueltas del API al formato del reproductor
    const songs = useMemo(() => {
        return (canciones || []).map((cancion) => normalizeSong(cancion, grupos));
    }, [canciones, grupos]);

    // usa la lista seleccionada para decidir si una cancion muestra X o +
    const cancionesEnListaSeleccionadaIds = useMemo(() => {
        return new Set(
            (listaSeleccionada?.canciones || [])
                .map((cancion) => cancion?.id)
                .filter(Boolean)
                .map(String)
        );
    }, [listaSeleccionada]);

    // filtra grupos por nombre
    const filteredGroups = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return groups;

        return groups.filter((group) =>
            group.name.toLowerCase().includes(term)
        );
    }, [search, groups]);

    // filtra canciones por grupo seleccionado o por texto
    const songsToShow = useMemo(() => {
        const term = search.trim().toLowerCase();
        let result = songs;

        if (selectedGroup) {
            result = result.filter((song) => song.grupo === selectedGroup.name);
        }

        if (!term) return result;

        return result.filter(
            (song) =>
                song.titulo.toLowerCase().includes(term) ||
                song.grupo.toLowerCase().includes(term)
        );
    }, [search, selectedGroup, songs]);

    // muestra el texto de grupo activo solo en la vista de canciones
    const showBackToGroups = activeTab === "songs" && selectedGroup;

    // ===============================
    // FUNCIONES Y EVENTOS
    // ===============================
    // cambia a la pestaña de canciones y fija el grupo activo
    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setActiveTab("songs");
        setSearch("");
    };

    // envia la cancion a Home para abrir ModalFavoritos
    const handleAbrirFavoritos = (song) => {
        onAbrirModalFavoritos?.(song);
    };

    // envia la cancion y la cola visible actual a Home
    const handleSeleccionarCancion = (cancion) => {
        onSeleccionarCancion?.(cancion, songsToShow);
    };

    // devuelve la referencia de scroll segun la pestaña activa
    const getCurrentScrollRef = () => {
        return activeTab === "groups"
            ? groupsScrollRef.current
            : songsScrollRef.current;
    };

    // revisa si hay contenido debajo para mostrar la flecha
    const checkScrollState = () => {
        const el = getCurrentScrollRef();
        if (!el) return;

        const hasMoreBelow =
            el.scrollTop + el.clientHeight < el.scrollHeight - 8;

        setShowBottomArrow(hasMoreBelow);
    };

    // mueve el scroll hacia abajo suavemente
    const handleScrollDown = () => {
        const currentRef = getCurrentScrollRef();
        if (!currentRef) return;

        currentRef.scrollBy({
            top: 250,
            behavior: "smooth",
        });
    };

    // ===============================
    // EFECTOS SECUNDARIOS
    // ===============================
    // actualiza la flecha al cambiar la vista o el contenido
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
    // RENDER PRINCIPAL
    // ===============================
    if (loading) {
        return (
            <section className="flex h-full min-h-0 w-full items-center justify-center rounded-[1.7rem] border border-white/10 bg-[#07070b] p-3 text-sm text-white/50">
                Cargando exploracion...
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
            <div className="mb-2 shrink-0">
                <div className="flex h-10 items-center rounded-full border border-white/10 bg-white/[0.04] px-4">
                    <Search size={16} className="mr-2 text-white/45" />
                    <input
                        type="text"
                        placeholder="Buscar cancion o grupo"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                    />
                </div>
            </div>

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

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem] bg-black p-4">
                {activeTab === "groups" ? (
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
                ) : (
                    <div
                        ref={songsScrollRef}
                        className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
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
                                    groupImage={selectedGroup ? selectedGroup.image : song.groupImage}
                                    groupName={selectedGroup ? selectedGroup.name : song.groupName}
                                    onSeleccionarCancion={handleSeleccionarCancion}
                                    onAbrirModalFavoritos={handleAbrirFavoritos}
                                    isAdded={cancionesEnListaSeleccionadaIds.has(String(song.id))}
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

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent" />

                {showBottomArrow && (
                    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
                        <button
                            onClick={handleScrollDown}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/30 bg-black/55 backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-fuchsia-400/50"
                            title="Ver mas"
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
