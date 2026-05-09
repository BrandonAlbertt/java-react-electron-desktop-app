import { Music } from "lucide-react";
import { useState } from "react";
import UploadBox from "./UploadBox";
import SelectGrupoBox from "./SelectGrupoBox";

export default function RegistrarMusicaForm({
  grupos = [],
}) {
  console.log("RegistrarMusicaForm recibió grupos:", grupos);
  // =============================
  // ESTADO DEL FORMULARIO
  // =============================
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [linkAudio, setLinkAudio] = useState("");
  const [duracion, setDuracion] = useState("");

  // =============================
  // MANEJADORES
  // =============================
  const handleSelectGrupo = (grupo) => {
    console.log("Grupo seleccionado:", { id: grupo.id, nombre: grupo.nombre });
    setSelectedGrupo({
      id: grupo.id,
      nombre: grupo.nombre,
    });
  };

  const handleRegistrar = async () => {
    if (!selectedGrupo) {
      alert("Por favor selecciona un grupo");
      return;
    }

    if (!titulo.trim()) {
      alert("Por favor ingresa el título de la canción");
      return;
    }

    const datosMusica = {
      titulo: titulo.trim(),
      letra: letra.trim(),
      grupoId: selectedGrupo.id,
      grupoNombre: selectedGrupo.nombre,
      linkAudio: linkAudio.trim(),
      duracion: duracion.trim(),
    };

    console.log("Datos a registrar:", datosMusica);
    // Aquí va la llamada a la API para registrar la música
    // await onRegistrarMusica(datosMusica);
  };

  const puedeRegistrar = !!selectedGrupo && !!titulo.trim();

  return (
    <section className="flex min-h-0 flex-col">
      <h3 className="mb-5 text-sm font-bold tracking-[0.25em] text-fuchsia-400 uppercase">
        Registrar música
      </h3>

      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-7">
        {/* ============================= */}
        {/* CAMPOS PRINCIPALES */}
        {/* ============================= */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Título de la canción
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Escribe el título de la canción..."
              className="w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Letra de la canción
            </label>

            <textarea
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
              placeholder="Escribe la letra de la canción..."
              className="min-h-[125px] w-full resize-none rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          {/* ============================= */}
          {/* SELECT GRUPO */}
          {/* ============================= */}
          <SelectGrupoBox
            grupos={grupos}
            selectedGroupId={selectedGrupo?.id}
            onSelect={handleSelectGrupo}
            placeholder="Seleccionar grupo"
          />

          {selectedGrupo && (
            <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                Grupo seleccionado
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                ID: {selectedGrupo.id} - {selectedGrupo.nombre}
              </p>
            </div>
          )}
        </div>

        {/* ============================= */}
        {/* CAMPOS SECUNDARIOS */}
        {/* ============================= */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Link de audio
            </label>

            <input
              type="text"
              value={linkAudio}
              onChange={(e) => setLinkAudio(e.target.value)}
              placeholder="Pega el link de audio..."
              className="w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Duración MM:SS
            </label>

            <input
              type="text"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              placeholder="00:00"
              className="w-full rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-center text-lg text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
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

      <button
        onClick={handleRegistrar}
        disabled={!puedeRegistrar}
        className={`mx-auto mt-7 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border px-5 py-3 font-bold transition ${
          puedeRegistrar
            ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500/30"
            : "border-white/10 bg-white/[0.025] text-white/30 cursor-not-allowed"
        }`}
      >
        <Music size={22} />
        Registrar música
      </button>
    </section>
  );
}