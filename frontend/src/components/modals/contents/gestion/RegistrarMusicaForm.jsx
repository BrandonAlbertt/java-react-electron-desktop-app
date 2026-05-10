import { Music } from "lucide-react";
import { useState } from "react";
import UploadBox from "./UploadBox";
import SelectGrupoBox from "./SelectGrupoBox";
import SelectGenerosBox from "./SelectGenerosBox";

export default function RegistrarMusicaForm({
  grupos = [],
  generos = [],
  onGuardarMusica = () => {},
}) {
  ///console.log("RegistrarMusicaForm recibió grupos:", grupos);
  // =============================
  // ESTADO DEL FORMULARIO
  // =============================
  // selectedGrupo: grupo seleccionado del dropdown
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  // titulo: título de la canción
  const [titulo, setTitulo] = useState("");
  // letra: letra de la canción
  const [letra, setLetra] = useState("");
  // duracion: duración de la canción en formato MM:SS (opcional)
  const [duracion, setDuracion] = useState("");
  // selectedGeneroIds: array de IDs de géneros seleccionados
  const [selectedGeneroIds, setSelectedGeneroIds] = useState([]);
  // archivoAudio: objeto File del audio subido
  const [archivoAudio, setArchivoAudio] = useState(null);
  // isSaving: indica si se está guardando
  const [isSaving, setIsSaving] = useState(false);

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

  //============================
  // handleRegistrar: valida campos y llama a onGuardarMusica con los datos
  // =============================    
  const handleRegistrar = async () => {
    if (!selectedGrupo) {
      alert("Por favor selecciona un grupo");
      return;
    }

    if (!titulo.trim()) {
      alert("Por favor ingresa el título de la canción");
      return;
    }

    if (!archivoAudio) {
      alert("Por favor sube un archivo de música");
      return;
    }

    const datosMusica = {
      titulo: titulo.trim(),
      letra: letra.trim(),
      grupo_id: selectedGrupo.id,
      generos_ids: selectedGeneroIds,
      duracion_segundos: Number(duracion) || 0,
      audio: archivoAudio,
    };

    console.log("Datos a registrar:", datosMusica);

    try {
      setIsSaving(true);
      await onGuardarMusica(datosMusica);
      // limpiar campos después de guardar exitosamente
      setTitulo("");
      setLetra("");
      setSelectedGrupo(null);
      setSelectedGeneroIds([]);
      setDuracion("");
      setArchivoAudio(null);
    } finally {
      setIsSaving(false);
    }
  };

  // puedeRegistrar: habilita el botón solo si hay grupo seleccionado, título y audio no vacío, y no está guardando
  const puedeRegistrar = !!selectedGrupo && !!titulo.trim() && !!archivoAudio && !isSaving;

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
              className="min-h-31.25 w-full resize-none rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-fuchsia-400"
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

            {/* ============================= */}
            {/* SELECT GENEROS */}
            {/* ============================= */}

            <SelectGenerosBox 
              generos={generos}
              selectedGeneroIds={selectedGeneroIds}
              onChangeGeneros={setSelectedGeneroIds}
            />

          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Duración MM:SS
            </label>

            <input
              type="text"
              value={duracion}
              readOnly
              placeholder="00"
              className="w-full cursor-not-allowed rounded-2xl border border-fuchsia-500/40 bg-black/30 px-4 py-3 text-center text-lg text-white outline-none placeholder:text-white/35"
            />
          </div>

          <UploadBox
            title="Suba la música"
            description="Haz clic o arrastra un archivo"
            extra="MP3, WAV, M4A · Máx. 20MB"
            type="music"
            onFileChange={({ file, duracionSegundos }) => {
              setArchivoAudio(file);
              setDuracion(String(duracionSegundos));
            }}
          />
        </div>
      </div>

      <button
        onClick={handleRegistrar}
        disabled={!puedeRegistrar}
        className={`mx-auto mt-7 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border px-5 py-3 font-bold transition ${
          puedeRegistrar
            ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500/30"
            : "border-white/10 bg-white/2.5 text-white/30 cursor-not-allowed"
        }`}
      >
        <Music size={22} />
        {isSaving ? "Registrando música..." : "Registrar música"}
      </button>
    </section>
  );
}