import { ChevronDown } from "lucide-react";

export default function SelectGrupoBox() {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-white">
        Seleccionar grupo
      </label>

      <button className="flex h-[74px] w-full items-center justify-between gap-3 rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/images/default-group.png"
            alt="Grupo"
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />

          <span className="truncate font-semibold">Los locos</span>
        </div>

        <ChevronDown size={22} className="shrink-0 text-white/70" />
      </button>
    </div>
  );
}
