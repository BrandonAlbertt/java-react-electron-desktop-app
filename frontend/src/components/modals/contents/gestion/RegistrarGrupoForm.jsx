import { Users } from "lucide-react";
import UploadBox from "./UploadBox";

export default function RegistrarGrupoForm() {
  return (
    <section className="flex min-h-0 min-w-0 flex-col lg:border-r lg:border-white/10 lg:pr-6">
      <h3 className="mb-5 text-center text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-400">
        Registrar grupo
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Ingrese el nombre del grupo
          </label>

          <input
            type="text"
            placeholder="Escribe el nombre del grupo..."
            className="
                h-12 w-full rounded-2xl
                border border-fuchsia-500/40
                bg-[#090511]
                px-5 text-sm text-white
                outline-none transition
                placeholder:text-white/25
                focus:border-fuchsia-400
                focus:shadow-[0_0_20px_rgba(217,70,239,0.18)]
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Ingrese el link de imagen
          </label>

          <input
            type="text"
            placeholder="Pega el link de la imagen..."
            className="
                h-12 w-full rounded-2xl
                border border-fuchsia-500/40
                bg-[#090511]
                px-5 text-sm text-white
                outline-none transition
                placeholder:text-white/25
                focus:border-fuchsia-400
                focus:shadow-[0_0_20px_rgba(217,70,239,0.18)]
            "
          />
        </div>

        <UploadBox
          title="Suba la imagen"
          description="Haz clic o arrastra una imagen"
          extra="JPG, PNG · Máx. 5MB"
          type="image"
        />

        <button className="mt-2 flex w-full items-center justify-center gap-3 rounded-2xl border border-fuchsia-400/60 bg-fuchsia-500/20 px-5 py-3 font-bold text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.45)] transition hover:bg-fuchsia-500/30">
          <Users size={20} />
          Registrar grupo
        </button>
      </div>
    </section>
  );
}
