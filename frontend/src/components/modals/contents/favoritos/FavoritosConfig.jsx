import { Plus } from "lucide-react";
import FavoritosFeaturedSong from "./FavoritosFeaturedSong";

/*
  FavoritosConfig.jsx

  columna derecha del modal.
  aquí se configura la lista seleccionada.
*/

export default function FavoritosConfig({
    listaSeleccionada,
    onAbrirAgregarCancion,
}) {
    return (
        <section
            className="
                flex min-h-0 flex-col
                border-t border-white/10 pt-6
                lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0
            "
        >
            {/* ============================= */}
            {/* TÍTULO DE LA SECCIÓN */}
            {/* ============================= */}
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400 sm:text-sm">
                Configurar lista
            </h3>

            {/* ============================= */}
            {/* CAMPO NOMBRE DE LA LISTA */}
            {/* ============================= */}
            <div>
                <label className="mb-3 block text-sm text-white/70">
                    Nombre de la lista
                </label>

                <input
                    type="text"
                    placeholder="Escribe el nombre de tu lista..."
                    defaultValue={listaSeleccionada?.nombre || ""}
                    className="
                        h-13 w-full rounded-2xl border border-fuchsia-500/30
                        bg-black/20 px-4 text-sm text-white outline-none transition
                        placeholder:text-white/35
                        focus:border-fuchsia-400/70
                        focus:shadow-[0_0_24px_rgba(217,70,239,0.18)]
                        sm:h-14 sm:px-5 sm:text-base
                    "
                />
            </div>

            {/* ============================= */}
            {/* CANCIÓN DESTACADA */}
            {/* ============================= */}
            <div className="mt-7">
                <label className="mb-4 block text-sm text-white/70">
                    Canción destacada{" "}
                    <span className="text-white/45">(opcional)</span>
                </label>

                <FavoritosFeaturedSong
                    imagen={listaSeleccionada?.imagen}
                    titulo="Sueles ser Mi amor"
                    grupo="Los Santos"
                />

                <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                    Esta canción representará tu lista en la biblioteca y en la pantalla
                    principal.
                </p>
            </div>

            {/* ============================= */}
            {/* BOTÓN PRINCIPAL */}
            {/* ============================= */}
            <button
                type="button"
                onClick={onAbrirAgregarCancion}
                className="
                    mt-6 flex h-14 w-full shrink-0 items-center justify-center gap-3
                    rounded-2xl border border-fuchsia-400/70
                    bg-fuchsia-500/10 text-base font-semibold text-white
                    shadow-[0_0_32px_rgba(217,70,239,0.22)]
                    transition hover:bg-fuchsia-500/20
                    hover:shadow-[0_0_42px_rgba(217,70,239,0.35)]
                    sm:h-15 sm:text-lg
                "
            >
                <Plus size={25} />
                Registrar canción
            </button>
        </section>
    );
}