// components/music/CarouselGeneres.jsx

import { useRef } from "react";

export default function CarouselGeneres({
    generos = [],
    generoSeleccionadoId,
    onSeleccionarGenero,
}) {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current?.scrollBy({
            left: -180,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({
            left: 180,
            behavior: "smooth",
        });
    };

    return (
        <div className="flex h-7 w-full items-center gap-2 rounded-full bg-[#151515] px-2 text-xs text-white/45">
            <button
                onClick={scrollLeft}
                className="shrink-0 text-white/60 transition hover:text-white"
            >
                ◀
            </button>

            <div
                ref={carouselRef}
                className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {generos.map((genero) => (
                    <button
                        key={genero.id}
                        onClick={() => onSeleccionarGenero(genero)}
                        className={`shrink-0 whitespace-nowrap transition hover:text-fuchsia-300 ${
                            generoSeleccionadoId === genero.id
                                ? "text-fuchsia-300"
                                : "text-white/45"
                        }`}
                    >
                        {genero.nombre}
                    </button>
                ))}
            </div>

            <button
                onClick={scrollRight}
                className="shrink-0 text-white/60 transition hover:text-white"
            >
                ▶
            </button>
        </div>
    );
}