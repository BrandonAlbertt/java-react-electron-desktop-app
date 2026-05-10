import RegistrarGrupoForm from "./RegistrarGrupoForm";
import RegistrarMusicaForm from "./RegistrarMusicaForm";

export default function GestionGrupoAndMusica({
  grupos = [],
  generos = [],
  onGuardarMusica = () => {},
}) {
  //console.log("GestionGrupoAndMusica recibió grupos:", grupos);
  return (
    <div className="grid w-full grid-cols-1 gap-6 text-left lg:grid-cols-[0.72fr_1.65fr]">
      {/* ============================= */}
      {/* FORMULARIO REGISTRAR GRUPO */}
      {/* ============================= */}
      <RegistrarGrupoForm />

      {/* ============================= */}
      {/* FORMULARIO REGISTRAR MUSICA */}
      {/* ============================= */}
      <RegistrarMusicaForm 
        grupos={grupos} 
        generos={generos}
        onGuardarMusica={onGuardarMusica}
      />
    </div>
  );
}

