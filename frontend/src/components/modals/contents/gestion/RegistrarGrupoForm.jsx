import { Users } from "lucide-react";
import { useState } from "react";
import UploadBox from "./UploadBox";

export default function RegistrarGrupoForm({
  onGuardarGrupo = () => {},
}) {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleRegistrarGrupo = async () => {
    if (!nombreGrupo.trim()) {
      alert("Por favor ingresa el nombre del grupo");
      return;
    }

    if (!archivoImagen) {
      alert("Por favor sube una imagen del grupo");
      return;
    }

    const datosGrupo = {
      nombre: nombreGrupo.trim(),
      imagen: archivoImagen,
    };

    try {
      setIsSaving(true);
      await onGuardarGrupo(datosGrupo);
      setNombreGrupo("");
      setArchivoImagen(null);
      // trigger UploadBox to reset its internal preview/state
      setUploadResetKey((k) => k + 1);
    } finally {
      setIsSaving(false);
    }
  };

  const puedeRegistrar = !!nombreGrupo.trim() && !!archivoImagen && !isSaving;

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
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
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

        <UploadBox
          title="Suba la imagen"
          description="Haz clic o arrastra una imagen"
          extra="JPG, PNG · Max. 5MB"
          type="image"
          onFileChange={({ file }) => {
            setArchivoImagen(file);
          }}
          resetKey={uploadResetKey}
        />

        <button
          type="button"
          onClick={handleRegistrarGrupo}
          disabled={!puedeRegistrar}
          className={`mt-2 flex w-full items-center justify-center gap-3 rounded-2xl border px-5 py-3 font-bold transition ${
            puedeRegistrar
              ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500/30"
              : "cursor-not-allowed border-white/10 bg-white/2.5 text-white/30"
          }`}
        >
          <Users size={20} />
          {isSaving ? "Registrando grupo..." : "Registrar grupo"}
        </button>
      </div>
    </section>
  );
}
