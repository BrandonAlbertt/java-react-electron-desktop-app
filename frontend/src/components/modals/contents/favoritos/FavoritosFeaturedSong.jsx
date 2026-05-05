import { Play } from "lucide-react";

/*
  FavoritosFeaturedSong.jsx

  tarjeta de canción destacada.
*/

export default function FavoritosFeaturedSong({ imagen, titulo, grupo }) {
    return (
        <div
            className="
                flex items-center gap-4 rounded-3xl border border-fuchsia-500/20
                bg-white/[0.025] p-4
                sm:gap-5
            "
        >
            {/* ============================= */}
            {/* IMAGEN DE LA CANCIÓN */}
            {/* ============================= */}
            <img
                src={imagen}
                alt={titulo || "Canción destacada"}
                className="
                    h-20 w-20 shrink-0 rounded-full object-cover
                    shadow-[0_0_28px_rgba(217,70,239,0.25)]
                    sm:h-22 sm:w-22
                    xl:h-24 xl:w-24
                "
            />

            {/* ============================= */}
            {/* INFORMACIÓN DE LA CANCIÓN */}
            {/* ============================= */}
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-base font-semibold text-white sm:text-lg">
                    {titulo}
                </h4>

                <p className="mt-1 text-sm text-white/50">
                    {grupo}
                </p>
            </div>

            {/* ============================= */}
            {/* BOTÓN PLAY */}
            {/* ============================= */}
            <button
                type="button"
                className="
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-full border border-fuchsia-500/35 bg-black/30
                    text-white transition hover:bg-fuchsia-500/20
                    sm:h-14 sm:w-14
                "
            >
                <Play size={22} fill="currentColor" />
            </button>
        </div>
    );
}