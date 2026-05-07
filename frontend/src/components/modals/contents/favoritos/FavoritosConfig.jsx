import { ListPlus, Save } from "lucide-react";
import FavoritosFeaturedSong from "./FavoritosFeaturedSong";

/*
  FavoritosConfig.jsx

  columna derecha del modal.
  separa la creacion de listas del guardado de cambios de seleccion.
*/

export default function FavoritosConfig({
    selectedSong,
    nombreNuevaLista,
    onCambiarNombreNuevaLista,
    onCrearNuevaLista,
    onGuardarCambios,
    hayCambios = false,
    isWorking = false,
    errorAccion,
}) {
    // =============================
    // DATOS DERIVADOS
    // =============================
    const tituloCancion =
        selectedSong?.titulo || selectedSong?.title || "Selecciona una cancion";
    const grupoCancion =
        selectedSong?.grupo || selectedSong?.groupName || "Sin grupo";
    const imagenCancion =
        selectedSong?.imagen_grupo ||
        selectedSong?.imagen ||
        selectedSong?.imagen_url ||
        selectedSong?.groupImage;

    const puedeCrearLista = !!nombreNuevaLista?.trim() && !isWorking;
    const puedeGuardarCambios = hayCambios && !!selectedSong?.id && !isWorking;

    return (
        <section
            className="
                flex min-h-0 flex-col
                border-t border-white/10 pt-6
                lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0
            "
        >
            {/* ============================= */}
            {/* TITULO DE LA SECCION */}
            {/* ============================= */}
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400 sm:text-sm">
                Gestionar cancion
            </h3>

            {/* ============================= */}
            {/* CREAR NUEVA LISTA */}
            {/* ============================= */}
            <div>
                <label className="mb-3 block text-sm text-white/70">
                    Nueva lista
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Escribe el nombre de tu lista..."
                        value={nombreNuevaLista}
                        onChange={(e) => onCambiarNombreNuevaLista?.(e.target.value)}
                        disabled={isWorking}
                        className="
                            h-13 min-w-0 flex-1 rounded-2xl border border-fuchsia-500/30
                            bg-black/20 px-4 text-sm text-white outline-none transition
                            placeholder:text-white/35
                            focus:border-fuchsia-400/70
                            focus:shadow-[0_0_24px_rgba(217,70,239,0.18)]
                            disabled:cursor-wait disabled:opacity-45
                            sm:h-14 sm:px-5 sm:text-base
                        "
                    />

                    <button
                        type="button"
                        onClick={onCrearNuevaLista}
                        disabled={!puedeCrearLista}
                        className="
                            flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl
                            border border-green-400/40 bg-green-400/10 text-green-300
                            transition hover:bg-green-400/20 hover:text-green-200
                            disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-green-400/10
                            sm:h-14 sm:w-14
                        "
                        title="Crear lista"
                    >
                        <ListPlus size={22} />
                    </button>
                </div>

                <p className="mt-3 text-xs leading-5 text-white/45">
                    La portada se toma automaticamente de la cancion seleccionada.
                </p>
            </div>

            {/* ============================= */}
            {/* CANCION SELECCIONADA */}
            {/* ============================= */}
            <div className="mt-7">
                <label className="mb-4 block text-sm text-white/70">
                    Cancion seleccionada
                </label>

                <FavoritosFeaturedSong
                    imagen={imagenCancion}
                    titulo={tituloCancion}
                    grupo={grupoCancion}
                />

                <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                    Marca o desmarca una o varias listas y guarda los cambios cuando termines.
                </p>

                {errorAccion && (
                    <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {errorAccion}
                    </p>
                )}
            </div>

            {/* ============================= */}
            {/* BOTON PRINCIPAL */}
            {/* ============================= */}
            <button
                type="button"
                onClick={onGuardarCambios}
                disabled={!puedeGuardarCambios}
                className="
                    mt-6 flex h-14 w-full shrink-0 items-center justify-center gap-3
                    rounded-2xl border border-fuchsia-400/70
                    bg-fuchsia-500/10 text-base font-semibold text-white
                    shadow-[0_0_32px_rgba(217,70,239,0.22)]
                    transition hover:bg-fuchsia-500/20
                    hover:shadow-[0_0_42px_rgba(217,70,239,0.35)]
                    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-fuchsia-500/10
                    sm:h-15 sm:text-lg
                "
            >
                <Save size={22} />
                Guardar cambios
            </button>
        </section>
    );
}
