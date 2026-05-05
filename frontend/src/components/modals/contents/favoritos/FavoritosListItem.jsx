import { Check, MoreVertical } from "lucide-react";

/*
  FavoritosListItem.jsx

  tarjeta individual de cada lista.
*/

export default function FavoritosListItem({ lista, isActive, onSeleccionarLista }) {
    // =============================
    // DATOS DERIVADOS
    // =============================
    // permite recibir canciones como número o como arreglo
    const cantidadCanciones = Array.isArray(lista?.canciones)
        ? lista.canciones.length
        : Number(lista?.canciones || 0);

    return (
        <button
            type="button"
            onClick={onSeleccionarLista}
            className={`group flex w-full items-center gap-3 rounded-3xl border px-3 py-3 text-left transition-all duration-300 sm:gap-4 sm:px-4 sm:py-4
                ${isActive
                    ? "border-fuchsia-500/60 bg-fuchsia-500/15 shadow-[0_0_28px_rgba(217,70,239,0.18)]"
                    : "border-white/5 bg-black/15 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                }
            `}
        >
            {/* ============================= */}
            {/* CHECK DE LISTA ACTIVA */}
            {/* ============================= */}
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition sm:h-9 sm:w-9
                    ${isActive
                        ? "border-fuchsia-300 bg-fuchsia-500 text-black"
                        : "border-white/10 bg-white/5 text-white/30 group-hover:text-fuchsia-300"
                    }
                `}
            >
                {isActive && <Check size={19} strokeWidth={3} />}
            </div>

            {/* ============================= */}
            {/* IMAGEN DE LA LISTA */}
            {/* ============================= */}
            <img
                src={lista?.imagen}
                alt={lista?.nombre || "Lista musical"}
                className="h-12 w-12 shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
            />

            {/* ============================= */}
            {/* INFORMACIÓN DE LA LISTA */}
            {/* ============================= */}
            <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-white sm:text-base">
                    {lista?.nombre}
                </h4>

                <p className="mt-1 text-xs text-white/50 sm:text-sm">
                    {cantidadCanciones} canciones
                </p>
            </div>

            {/* ============================= */}
            {/* BOTÓN DE OPCIONES */}
            {/* ============================= */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/45 transition group-hover:bg-white/5 group-hover:text-white sm:h-9 sm:w-9">
                <MoreVertical size={21} />
            </div>
        </button>
    );
}