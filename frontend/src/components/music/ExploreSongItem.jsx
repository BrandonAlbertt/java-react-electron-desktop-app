import MarqueeText from "./MarqueeText";

/*
    Guia corta para entender este archivo (nivel principiante):
    - ExploreSongItem es un componente hijo: renderiza una sola fila de cancion.
    - ExplorePanel es el componente padre: arma la lista y le pasa props como song, isActive, isPlaying, onSeleccionarCancion y onToggleFavorite.
    - MarqueeText es otro componente reutilizable: mueve el texto cuando no cabe en el ancho disponible.
    - Flujo de eventos: al hacer click en play o favorito, ExploreSongItem llama funciones del padre.
    - No controla estados globales: solo recibe datos y avisa eventos.
*/

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function ExploreSongItem({
    song,
    groupImage,
    groupName,
    onSeleccionarCancion,
    onToggleFavorite,
    isActive = false,
    isPlaying = false,
}) {
    // ===============================
    // DATOS SEGUROS DE LA CANCIÓN
    // ===============================
    // acepta formato de explore y tambien formato directo de la api
    const songTitle = song?.title || song?.titulo || "Canción sin título";
    const songGroup = groupName || song?.groupName || song?.grupo || "Grupo desconocido";
    const songImage = groupImage || song?.groupImage || song?.imagen_url || "";
    const songDuration = song?.duration || song?.duracion_segundos || 0;

    // ===============================
    // FORMATO DE DURACIÓN
    // ===============================
    // convierte segundos a mm:ss si duration viene como numero
    const formatDuration = (duration) => {
        if (!duration) return "0:00";

        if (typeof duration === "string") {
            return duration;
        }

        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);

        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={`relative flex items-center gap-3 rounded-full px-4 py-3 transition duration-300 ${isActive
                    ? "z-10 overflow-hidden border border-fuchsia-500/35 bg-[#15151f]"
                    : "bg-black hover:bg-[#0d0d12]"
                }`}
        >
            {/* BRILLO INTERNO CUANDO LA CANCIÓN ESTÁ ACTIVA */}
            {isActive && (
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_18%_50%,rgba(217,70,239,0.34),rgba(217,70,239,0.14)_40%,transparent_72%)]" />
            )}

            {/* BOTÓN PLAY / PAUSE */}
            <button
                type="button"
                onClick={() => onSeleccionarCancion?.(song)}
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-110"
                title={isPlaying ? "Pausar" : "Reproducir"}
            >
                <span className="text-3xl leading-none">
                    {isPlaying ? "❚❚" : "▶"}
                </span>
            </button>

            {/* IMAGEN DEL GRUPO */}
            {songImage ? (
                <img
                    src={songImage}
                    alt={songGroup}
                    className={`relative z-10 h-12 w-12 shrink-0 rounded-full object-cover transition ${isActive ? "ring-1 ring-fuchsia-500/45" : ""
                        }`}
                />
            ) : (
                <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white/45 transition ${isActive ? "ring-1 ring-fuchsia-500/45" : ""
                        }`}
                >
                    ♪
                </div>
            )}

            {/* TEXTO */}
            <div className="relative z-10 min-w-0 flex-1">
                <MarqueeText
                    text={songTitle}
                    className={`text-lg font-bold ${isActive ? "text-fuchsia-300" : "text-white"
                        }`}
                    speed={14}
                />

                <MarqueeText
                    text={songGroup}
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
                {formatDuration(songDuration)}
            </span>

            {/* FAVORITO */}
            <button
                type="button"
                onClick={() => onToggleFavorite?.(song?.id)}
                className={`relative z-10 ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl font-bold transition hover:scale-110 ${song?.isFavorite
                        ? "text-red-500 hover:text-red-400"
                        : "text-fuchsia-500 hover:text-fuchsia-400"
                    }`}
                title={song?.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                {song?.isFavorite ? "×" : "+"}
            </button>
        </div>
    );
}

/*
    Uso rapido en un componente padre:

    import ExploreSongItem from "./ExploreSongItem";

    <ExploreSongItem
        song={song}
        groupImage={song.groupImage}
        groupName={song.groupName}
        isActive={activeSongId === song.id}
        isPlaying={activeSongId === song.id && isPlaying}
        onSeleccionarCancion={handleSeleccionarCancion}
        onToggleFavorite={handleToggleFavorite}
    />

    Condiciones minimas:
    - song debe incluir al menos: id, title o titulo
    - duration puede venir como segundos o texto
    - groupImage y groupName son opcionales, pero recomendados
    - onSeleccionarCancion y onToggleFavorite deben ser funciones
*/