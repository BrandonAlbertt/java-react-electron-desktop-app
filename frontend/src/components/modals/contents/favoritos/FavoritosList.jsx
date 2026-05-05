import FavoritosListItem from "./FavoritosListItem";

/*
  FavoritosList.jsx

  columna izquierda del modal.
  muestra todas las listas favoritas.
*/

export default function FavoritosList({
    listas = [],
    listaSeleccionadaId,
    onSeleccionarLista,
}) {
    return (
        <section className="flex min-h-0 flex-col">
            {/* ============================= */}
            {/* TÍTULO DE LA SECCIÓN */}
            {/* ============================= */}
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400 sm:text-sm">
                Selecciona una lista
            </h3>

            {/* ============================= */}
            {/* CONTENEDOR DE LISTAS */}
            {/* ============================= */}
            <div
                className="
                    min-h-[250px] overflow-hidden rounded-3xl
                    border border-white/10 bg-white/[0.025] p-2
                    sm:p-3 lg:min-h-0 lg:flex-1
                "
            >
                <div
                    className="
                        custom-scrollbar max-h-[330px] space-y-3 overflow-y-auto
                        pr-1 sm:pr-2 lg:h-full lg:max-h-none
                    "
                >
                    {listas.map((lista) => (
                        <FavoritosListItem
                            key={lista.id}
                            lista={lista}
                            isActive={lista.id === listaSeleccionadaId}
                            onSeleccionarLista={() => onSeleccionarLista?.(lista.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}