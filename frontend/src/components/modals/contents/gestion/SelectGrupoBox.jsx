import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
//imagen cuando no hay imagen de playlist
import ningunoGrupo from "../../../../assets/ninguno-grupo.png";

export default function SelectGrupoBox({
  grupos = [],
  selectedGroupId = null,
  onSelect = () => {},
  placeholder = "Seleccionar grupo",
}) {
  //console.log("Lista de grupos en SelectGrupoBox:", grupos);

  // =============================
  // ESTADOS Y REFERENCIAS
  // =============================
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const ref = useRef(null);

  // =============================
  // CERRAR AL HACER CLICK FUERA
  // =============================
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

  // =============================
  // DATOS DEL SELECT
  // =============================
  const options = Array.isArray(grupos) ? grupos : [];

  const filtered = query
    ? options.filter((g) =>
        (g.nombre || "").toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const currentSelectedId = selectedGroupId ?? internalSelectedId;

  const selected =
    options.find((g) => String(g.id) === String(currentSelectedId)) || null;

  // =============================
  // EVENTOS
  // =============================
  function handleSelect(group) {
    setInternalSelectedId(group.id);
    onSelect(group);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const group = filtered[highlightIndex];

      if (group) {
        handleSelect(group);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <label className="mb-2 block text-sm font-semibold text-white">
        {placeholder}
      </label>

      <div className="relative">
        {/* ============================= */}
        {/* BOTON PRINCIPAL */}
        {/* ============================= */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex h-[74px] w-full items-center justify-between gap-3
            rounded-2xl border border-fuchsia-500/40
            bg-black/30 px-4 text-white
            transition hover:border-fuchsia-400/70 hover:bg-black/40
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={
                selected?.imagen_url ||
                selected?.imagen ||
                ningunoGrupo
              }
              alt={selected?.nombre || "Grupo"}
              className="
                h-11 w-11 shrink-0 rounded-xl object-cover
                border border-white/10 bg-black/40
              "
            />

            <span className="truncate text-sm font-bold">
              {selected?.nombre || "Seleccione un grupo"}
            </span>
          </div>

          <ChevronDown
            size={22}
            className={`shrink-0 text-white/70 transition ${
              open ? "rotate-180 text-fuchsia-300" : ""
            }`}
          />
        </button>

        {/* ============================= */}
        {/* LISTA FLOTANTE ARRIBA */}
        {/* ============================= */}
        {open && (
          <div
            className="
              absolute left-0 right-0 bottom-[calc(100%+12px)] z-[9999]
              overflow-hidden rounded-[1.6rem]
              border border-fuchsia-500/25
              bg-[#07030d]/95 backdrop-blur-2xl
              shadow-[0_20px_80px_rgba(0,0,0,0.85)]
            "
          >
            {/* ============================= */}
            {/* BUSCADOR */}
            {/* ============================= */}
            <div className="border-b border-white/10 p-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Buscar grupo..."
                className="
                  w-full rounded-2xl border border-fuchsia-500/20
                  bg-black/35 px-4 py-3 text-sm text-white
                  outline-none placeholder:text-white/35
                  focus:border-fuchsia-400
                  focus:shadow-[0_0_18px_rgba(217,70,239,0.25)]
                "
              />
            </div>

            {/* ============================= */}
            {/* LISTA CON SCROLL OCULTO */}
            {/* ============================= */}
            <ul
              className="
                max-h-[230px] overflow-y-auto p-2
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {filtered.length === 0 && (
                <li className="px-3 py-3 text-sm text-white/50">
                  No hay resultados
                </li>
              )}

              {filtered.map((g, idx) => (
                <li
                  key={g.id}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  onClick={() => handleSelect(g)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                    idx === highlightIndex
                      ? "bg-fuchsia-500/15 shadow-[0_0_20px_rgba(217,70,239,0.18)]"
                      : "hover:bg-white/[0.045]"
                  }`}
                >
                  <img
                    src={
                      g.imagen_url ||
                      g.imagen ||
                      "/images/default-group.png"
                    }
                    alt={g.nombre || "Grupo"}
                    className="
                      h-11 w-11 shrink-0 rounded-xl object-cover
                      border border-white/10 bg-black/40
                    "
                  />

                  <div className="min-w-0 text-left">
                    <div className="truncate text-sm font-bold text-white">
                      {g.nombre || "Grupo sin nombre"}
                    </div>

                    <div className="text-xs text-white/40">ID: {g.id}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ============================= */}
            {/* CONTADOR */}
            {/* ============================= */}
            <div className="border-t border-white/10 px-4 py-2 text-xs text-white/35">
              {filtered.length} grupo(s) encontrados
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

