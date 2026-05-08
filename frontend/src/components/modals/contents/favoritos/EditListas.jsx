import { Edit3, ListMusic, Save } from "lucide-react";
import FavoritosList from "./FavoritosList";
import { useMemo } from "react";

export default function EditListas({
    listas = [],
    onSeleccionar,
    listaSeleccionadaId,
    onRenombrarLista,
    onEliminarLista,
    listasSeleccionadasIds = [],
    nombreLista = "",
    onNombreListaChange,
    onGuardar,
    isWorking = false,
    puedeGuardar = false,
}) {
    const listaSeleccionada = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
    }, [listas, listaSeleccionadaId]);

    const cantidadCanciones = Array.isArray(listaSeleccionada?.canciones)
        ? listaSeleccionada.canciones.length
        : Number(listaSeleccionada?.canciones || 0);

    return (
        <div className="grid h-full min-h-[430px] grid-cols-1 gap-7 lg:grid-cols-[1.05fr_1fr]">
            {/* ============================= */}
            {/* COLUMNA IZQUIERDA - LISTAS */}
            {/* ============================= */}
            <FavoritosList
                listas={listas}
                listasSeleccionadasIds={listasSeleccionadasIds}
                isWorking={isWorking}
                onSeleccionarLista={onSeleccionar}
                onEliminarLista={onEliminarLista}
            />

            {/* ============================= */}
            {/* COLUMNA DERECHA - EDICION */}
            {/* ============================= */}
            <section className="flex min-h-0 flex-col border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400 sm:text-sm">
                    Editar nombre de lista
                </h3>

                {!listaSeleccionada ? (
                    <div
                        className="
                            flex flex-1 flex-col items-center justify-center rounded-3xl
                            border border-white/10 bg-white/[0.025] p-8 text-center
                        "
                    >
                        <div
                            className="
                                mb-5 flex h-20 w-20 items-center justify-center rounded-full
                                border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300
                            "
                        >
                            <ListMusic size={36} />
                        </div>

                        <h4 className="text-lg font-bold text-white">
                            Selecciona una lista
                        </h4>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">
                            Elige una playlist de la columna izquierda para editar su nombre.
                        </p>
                    </div>
                ) : (
                    <div
                        className="
                            flex flex-1 flex-col rounded-3xl border border-fuchsia-500/25
                            bg-black/25 p-5 shadow-[0_0_35px_rgba(217,70,239,0.10)]
                        "
                    >
                        {/* ============================= */}
                        {/* CARD DE LISTA SELECCIONADA */}
                        {/* ============================= */}
                        <div
                            className="
                                flex items-center gap-4 rounded-3xl border border-white/10
                                bg-white/[0.035] p-4
                            "
                        >
                            <img
                                src={listaSeleccionada.imagen}
                                alt={listaSeleccionada.nombre || "Playlist"}
                                className="
                                    h-20 w-20 rounded-3xl object-cover
                                    shadow-[0_0_25px_rgba(217,70,239,0.22)]
                                "
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                                    Lista seleccionada
                                </p>

                                <h4 className="mt-2 truncate text-xl font-bold text-white">
                                    {listaSeleccionada.nombre}
                                </h4>

                                <p className="mt-1 text-sm text-white/45">
                                    {cantidadCanciones} canciones
                                </p>
                            </div>

                            <div
                                className="
                                    hidden h-12 w-12 items-center justify-center rounded-2xl
                                    border border-fuchsia-500/30 bg-fuchsia-500/10
                                    text-fuchsia-300 sm:flex
                                "
                            >
                                <Edit3 size={22} />
                            </div>
                        </div>

                        {/* ============================= */}
                        {/* FORMULARIO */}
                        {/* ============================= */}
                        <div className="mt-7">
                            <label className="mb-3 block text-sm font-semibold text-white/70">
                                Cambiar nombre de lista
                            </label>

                            <input
                                type="text"
                                value={nombreLista}
                                onChange={(e) => onNombreListaChange?.(e.target.value)}
                                disabled={isWorking}
                                placeholder="Escribe el nuevo nombre..."
                                className="
                                    w-full rounded-2xl border border-fuchsia-500/35
                                    bg-[#090510] px-5 py-4 text-sm font-semibold text-white
                                    outline-none transition placeholder:text-white/30
                                    focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.18)]
                                    disabled:cursor-wait disabled:opacity-60
                                "
                            />

                            <p className="mt-3 text-xs leading-5 text-white/40">
                                El nuevo nombre se guardará solo para la playlist seleccionada.
                            </p>
                        </div>

                        {/* ============================= */}
                        {/* BOTON GUARDAR */}
                        {/* ============================= */}
                        <div className="mt-auto pt-7">
                            <button
                                type="button"
                                onClick={onGuardar}
                                disabled={!puedeGuardar}
                                className={`
                                    flex w-full items-center justify-center gap-3 rounded-2xl
                                    border px-5 py-4 text-sm font-bold transition
                                    ${puedeGuardar
                                        ? "border-fuchsia-400/60 bg-fuchsia-500 text-black shadow-[0_0_30px_rgba(217,70,239,0.28)] hover:scale-[1.01]"
                                        : "cursor-not-allowed border-white/10 bg-white/[0.035] text-white/30"
                                    }
                                `}
                            >
                                <Save size={19} />
                                {isWorking ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
