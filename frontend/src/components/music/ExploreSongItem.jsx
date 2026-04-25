import MarqueeText from "./MarqueeText";
/*
    Guia corta para entender este archivo (nivel principiante):
    - ExploreSongItem (este archivo) es un componente hijo: renderiza una sola fila de cancion.
    - ExplorePanel es el componente padre: arma la lista y le pasa props como song, isActive, isPlaying, onPlay y onToggleFavorite.
    - MarqueeText es otro componente reutilizable: solo se encarga de mover el texto cuando no cabe en el ancho disponible.
    - Flujo de eventos: al hacer click en Play o Favorito, ExploreSongItem llama funciones del padre (onPlay/onToggleFavorite) y el padre actualiza el estado global de la lista.
    - Estilo especial no Tailwind comun: bg-[radial-gradient(...)] crea el brillo interno de la cancion activa.
*/




export default function ExploreSongItem({
    song,
    groupImage,
    groupName,
    onPlay,
    onToggleFavorite,
    isActive = false,
    isPlaying = false,
}) {
    return (
        <div
            className={`flex items-center gap-3 rounded-full px-4 py-3 transition duration-300 ${isActive
                    ? "relative z-10 overflow-hidden bg-[#15151f] border border-fuchsia-500/35"
                    : "bg-black hover:bg-[#0d0d12]"
                }`}
        >
            {isActive && (
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_18%_50%,rgba(217,70,239,0.34),rgba(217,70,239,0.14)_40%,transparent_72%)]" />
            )}

            {/* BOTÓN PLAY / PAUSE */}
            <button
                onClick={() => onPlay?.(song)}
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-110"
            >
                <span className="text-3xl leading-none">
                    {isPlaying ? "❚❚" : "▶"}
                </span>
            </button>

            {/* IMAGEN */}
            <img
                src={groupImage}
                alt={groupName}
                className={`relative z-10 h-12 w-12 shrink-0 rounded-full object-cover transition ${isActive ? "ring-1 ring-fuchsia-500/45" : ""
                    }`}
            />

            {/* TEXTO */}
            <div className="relative z-10 min-w-0 flex-1">
                <MarqueeText
                    text={song.title}
                    className={`text-lg font-bold ${isActive ? "text-fuchsia-300" : "text-white"
                        }`}
                    speed={14}
                />

                <MarqueeText
                    text={groupName}
                    className={`text-sm ${isActive ? "text-white/80" : "text-white/60"
                        }`}
                    speed={13}
                />
            </div>

            {/* DURACIÓN */}
            <span
                className={`relative z-10 shrink-0 text-sm ${isActive ? "text-white" : "text-white/75"
                    }`}
            >
                {song.duration}
            </span>

            {/* FAVORITO */}
            <button
                onClick={() => onToggleFavorite?.(song.id)}
                className={`relative z-10 ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl font-bold transition hover:scale-110 ${song.isFavorite
                        ? "text-red-500 hover:text-red-400"
                        : "text-fuchsia-500 hover:text-fuchsia-400"
                    }`}
            >
                {song.isFavorite ? "X" : "+"}
            </button>
        </div>
    );
}

/*
        Uso rapido en un componente padre:

        import ExploreSongItem from "./ExploreSongIntem";

        <ExploreSongItem
            song={song}
            groupImage={song.groupImage}
            groupName={song.groupName}
            isActive={activeSongId === song.id}
            isPlaying={activeSongId === song.id && isPlaying}
            onPlay={handlePlay}
            onToggleFavorite={handleToggleFavorite}
        />

        Condiciones minimas:
        - song debe incluir al menos: id, title, duration, isFavorite
        - groupImage y groupName deben tener valor para mostrar portada y nombre
        - onPlay y onToggleFavorite deben ser funciones
*/