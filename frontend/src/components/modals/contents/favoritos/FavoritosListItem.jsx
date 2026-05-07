import { Check, MoreVertical, Plus, X } from "lucide-react";

/*
  FavoritosListItem.jsx

  tarjeta individual de cada lista.
  permite seleccionar la lista y eliminarla desde el menu de tres puntos.
*/

export default function FavoritosListItem({
    lista,
    isActive,
    disabled = false,
    onSeleccionarLista,
    onEliminarLista,
}) {
    // =============================
    // DATOS DERIVADOS
    // =============================
    const cantidadCanciones = Array.isArray(lista?.canciones)
        ? lista.canciones.length
        : Number(lista?.canciones || 0);

    return (
        <div
            className={`group/lista relative flex w-full items-center gap-2 rounded-3xl border px-3 py-3 text-left transition-all duration-300 sm:gap-3 sm:px-4 sm:py-4
                ${isActive
                    ? "border-fuchsia-500/60 bg-fuchsia-500/15 shadow-[0_0_28px_rgba(217,70,239,0.18)]"
                    : "border-white/5 bg-black/15 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                }
                ${disabled ? "cursor-wait opacity-70" : ""}
            `}
        >
            {/* ============================= */}
            {/* BOTON PRINCIPAL DE SELECCION */}
            {/* ============================= */}
            <button
                type="button"
                onClick={onSeleccionarLista}
                disabled={disabled}
                className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
            >
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition sm:h-9 sm:w-9
                        ${isActive
                            ? "border-fuchsia-300 bg-fuchsia-500 text-black"
                            : "border-white/10 bg-white/5 text-white/30 group-hover/lista:text-fuchsia-300"
                        }
                    `}
                >
                    {isActive && <Check size={19} strokeWidth={3} />}
                </div>

                {/* ============================= */}
                {/* ESTADO AGREGAR / QUITAR */}
                {/* ============================= */}
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition sm:h-9 sm:w-9
                        ${isActive
                            ? "border-red-500/35 bg-red-500/10 text-red-400"
                            : "border-green-400/25 bg-green-400/10 text-green-300"
                        }
                    `}
                    title={isActive ? "Quitar cancion de esta lista" : "Agregar cancion a esta lista"}
                >
                    {isActive ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                </div>

                <img
                    src={lista?.imagen}
                    alt={lista?.nombre || "Lista musical"}
                    className="h-12 w-12 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
                />

                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-white sm:text-base">
                        {lista?.nombre}
                    </h4>

                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
                        {cantidadCanciones} canciones
                    </p>
                </div>
            </button>

            {/* ============================= */}
            {/* MENU DE TRES PUNTOS */}
            {/* ============================= */}
            <div className="group/menu relative flex h-9 w-9 shrink-0 items-center justify-center">
                <button
                    type="button"
                    disabled={disabled}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/45 transition hover:bg-white/5 hover:text-white disabled:cursor-wait"
                    title="Opciones de lista"
                >
                    <MoreVertical size={21} />
                </button>

                <div
                    className="
                        pointer-events-none absolute right-0 top-9 z-20 min-w-36
                        rounded-2xl border border-red-500/20 bg-[#10070b] p-1
                        opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.45)]
                        transition group-hover/menu:pointer-events-auto group-hover/menu:opacity-100
                        group-focus-within/menu:pointer-events-auto group-focus-within/menu:opacity-100
                    "
                >
                    <button
                        type="button"
                        onClick={onEliminarLista}
                        disabled={disabled}
                        className="
                            w-full rounded-xl px-3 py-2 text-left text-xs font-semibold
                            text-red-200 transition hover:bg-red-500/15 hover:text-red-100
                            disabled:cursor-wait disabled:opacity-50
                        "
                    >
                        Eliminar lista
                    </button>
                </div>
            </div>
        </div>
    );
}
