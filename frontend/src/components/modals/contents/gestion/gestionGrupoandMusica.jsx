import RegistrarGrupoForm from "./RegistrarGrupoForm";
import RegistrarMusicaForm from "./RegistrarMusicaForm";

export default function GestionGrupoAndMusica() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 text-left lg:grid-cols-[0.72fr_1.65fr]      min-h-0 rounded-3xl border border-white/10
                                bg-white/[0.025] p-5 text-center lg:p-6 ">
      <RegistrarGrupoForm />
      <RegistrarMusicaForm />
    </div>
  );
}
