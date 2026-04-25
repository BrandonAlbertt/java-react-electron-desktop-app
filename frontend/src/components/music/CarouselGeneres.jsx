// components/music/CarouselGenres.jsx

const genres = ["Anime", "JPop", "Rock", "Bals", "Pop"];

export default function CarouselGenres() {
    return (
        <div className="flex h-7 w-full items-center gap-2 rounded-full bg-[#151515] px-2 text-xs text-white/45">
            <button className="shrink-0 text-white/60 hover:text-white">
                ◀
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-around gap-4 overflow-hidden">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        className="shrink-0 transition hover:text-fuchsia-300"
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <button className="shrink-0 text-white/60 hover:text-white">
                ▶
            </button>
        </div>
    );
}