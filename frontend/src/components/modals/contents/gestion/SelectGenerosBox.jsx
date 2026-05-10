// ============================================================================
// IMPORTS
// ============================================================================
// iconos de lucide-react y hooks de react
import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ============================================================================
// COMPONENT: SELECTGENEROSBOX
// ============================================================================
// multiselect de géneros musicales con búsqueda y dropdown

export default function SelectGenerosBox({
  generos = [],
  selectedGeneroIds = [],
  onChangeGeneros = () => {},
  placeholder = "Seleccionar géneros",

}) {
  // ========================================================================
  // ESTADO
  // ========================================================================
  // open: dropdown abierto o cerrado
  const [open, setOpen] = useState(false);
  // query: texto de búsqueda en el input
  const [query, setQuery] = useState("");
  // ref: referencia al contenedor para detectar clicks fuera
  const ref = useRef(null);

  // ========================================================================
  // EFECTO: DETECTAR CLICKS FUERA DEL DROPDOWN
  // ========================================================================
  // cierra el dropdown si hace click fuera del componente
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ========================================================================
  // CÁLCULOS DERIVADOS
  // ========================================================================
  // options: asegurar que generos sea un array válido
  const options = Array.isArray(generos) ? generos : [];

  // filtered: géneros filtrados por búsqueda o todos si query está vacío
  const filtered = query
    ? options.filter((g) =>
        (g.nombre || "").toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // selectedGeneros: datos completos de los géneros seleccionados
  const selectedGeneros = options.filter((g) =>
    selectedGeneroIds.includes(g.id)
  );

  // ========================================================================
  // HANDLERS
  // ========================================================================
  // toggleGenero: agregar o quitar un género de la selección
  function toggleGenero(genero) {
    const yaExiste = selectedGeneroIds.includes(genero.id);

    if (yaExiste) {
      onChangeGeneros(selectedGeneroIds.filter((id) => id !== genero.id));
      return;
    }

    onChangeGeneros([...selectedGeneroIds, genero.id]);
  }

  // removeGenero: quitar un género específico por clic en X
  function removeGenero(id) {
    onChangeGeneros(selectedGeneroIds.filter((generoId) => generoId !== id));
  }

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div ref={ref} className="relative">
      {/* LABEL */}
      <label className="mb-2 block text-sm font-semibold text-white">
        {placeholder}
      </label>

      {/* BOTÓN TOGGLE DROPDOWN */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex min-h-18.5 w-full items-center justify-between gap-3
          rounded-2xl border border-fuchsia-500/40
          bg-black/30 px-4 py-3 text-white
          transition hover:border-fuchsia-400/70 hover:bg-black/40
        "
      >
        {/* CONTENEDOR DE TAGS SELECCIONADOS O PLACEHOLDER */}
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {selectedGeneros.length === 0 ? (
            <span className="text-sm font-semibold text-white/45">
              Seleccione uno o varios géneros
            </span>
          ) : (
            // mostrar tags de cada género seleccionado
            selectedGeneros.map((genero) => (
              <span
                key={genero.id}
                className="
                  flex items-center gap-2 rounded-full
                  border border-fuchsia-400/30
                  bg-fuchsia-500/15 px-3 py-1
                  text-xs font-bold text-fuchsia-100
                "
              >
                {genero.nombre}

                {/* BOTÓN REMOVER GÉNERO */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeGenero(genero.id);
                  }}
                  className="cursor-pointer text-white/60 hover:text-white"
                >
                  <X size={13} />
                </span>
              </span>
            ))
          )}
        </div>

        {/* ICONO CHEVRON ROTADO SI DROPDOWN ABIERTO */}
        <ChevronDown
          size={22}
          className={`shrink-0 text-white/70 transition ${
            open ? "rotate-180 text-fuchsia-300" : ""
          }`}
        />
      </button>

      {/* DROPDOWN DESPLEGABLE */}
      {open && (
        <div
          className="
            absolute left-0 right-0 top-[calc(100%+12px)] z-9999
            overflow-hidden rounded-[1.6rem]
            border border-fuchsia-500/25
            bg-[#07030d]/95 backdrop-blur-2xl
            shadow-[0_20px_80px_rgba(0,0,0,0.85)]
          "
        >
          {/* SECCIÓN: INPUT DE BÚSQUEDA */}
          <div className="border-b border-white/10 p-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar género..."
              className="
                w-full rounded-2xl border border-fuchsia-500/20
                bg-black/35 px-4 py-3 text-sm text-white
                outline-none placeholder:text-white/35
                focus:border-fuchsia-400
              "
            />
          </div>

          {/* SECCIÓN: LISTA DE OPCIONES FILTRADAS */}
          <ul
            className="
              max-h-57.5 overflow-y-auto p-2
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {filtered.length === 0 && (
              // mostrar si no hay resultados de búsqueda
              <li className="px-3 py-3 text-sm text-white/50">
                No hay resultados
              </li>
            )}

            {filtered.map((g) => {
              const isSelected = selectedGeneroIds.includes(g.id);

              return (
                // cada opción puede seleccionarse/deseleccionarse
                <li
                  key={g.id}
                  onClick={() => toggleGenero(g)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl px-3 py-3 transition ${
                    isSelected
                      ? "bg-fuchsia-500/15 text-fuchsia-100"
                      : "text-white hover:bg-white/4.5"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">{g.nombre}</p>
                    <p className="text-xs text-white/40">ID: {g.id}</p>
                  </div>

                  <span className="text-xs font-bold">
                    {isSelected ? "Seleccionado" : "Agregar"}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* SECCIÓN: PIE DE PÁGINA CON CONTADOR */}
          <div className="border-t border-white/10 px-4 py-2 text-xs text-white/35">
            {selectedGeneroIds.length} género(s) seleccionado(s)
          </div>
        </div>
      )}
    </div>
  );
}