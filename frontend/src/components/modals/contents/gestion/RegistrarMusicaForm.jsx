import { Music } from "lucide-react";
import UploadBox from "./UploadBox";
import SelectGrupoBox from "./SelectGrupoBox";

export default function RegistrarMusicaForm() {
  return (
    <section className="flex min-h-0 min-w-0 flex-col">
      <h3 className="mb-5 text-center text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-400">
        Registrar música
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.18fr_0.9fr]">
        
        {/* ============================= */}
        {/* CAMPOS PRINCIPALES */}
        {/* ============================= */}
        <div className="min-w-0 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Título de la canción
            </label>

            <input
              type="text"
              placeholder="Escribe el título de la canción..."
              className="h-12 w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Letra de la canción
            </label>

            <textarea
              placeholder="Escribe la letra de la canción..."
              className="min-h-[104px] w-full resize-none rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <SelectGrupoBox />
        </div>

        {/* ============================= */}
        {/* CAMPOS SECUNDARIOS */}
        {/* ============================= */}
        <div className="min-w-0 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Link de audio
            </label>

            <input
              type="text"
              placeholder="Pega el link de audio..."
              className="h-12 w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Duración MM:SS
            </label>

            <input
              type="text"
              placeholder="00:00"
              className="h-12 w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 text-center text-lg text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <UploadBox
            title="Suba la música"
            description="Haz clic o arrastra un archivo"
            extra="MP3, WAV, M4A · Máx. 20MB"
            type="music"
          />
        </div>
      </div>

      <button className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-fuchsia-400/60 bg-fuchsia-500/20 px-5 py-3 font-bold text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.45)] transition hover:bg-fuchsia-500/30">
        <Music size={22} />
        Registrar música
      </button>
    </section>
  );
}
