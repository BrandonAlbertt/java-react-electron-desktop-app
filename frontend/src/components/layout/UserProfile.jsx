/*
  UserProfile.jsx

  Este componente muestra la información básica del usuario
  en la parte superior izquierda de la aplicación.

  Funcionalidades principales:
  - Mostrar imagen o avatar del usuario
  - Mostrar nombre o nickname
  - Mantener un tamaño estable dentro del header superior

  Props que recibe:
  - userName → nombre visible del usuario
  - userImage → imagen del usuario

  Componentes que necesita:
  - No depende de otros componentes
*/

export default function UserProfile({ userName, userImage }) {
  return (
    <div className="no-drag flex min-w-[180px] items-center gap-3 pt-6 pl-5">
      
      {/* CONTENEDOR DEL AVATAR */}
      <div className="relative flex items-center justify-center">
        
        {/* halo neon suave */}
        <div className="absolute h-[70px] w-[70px] rounded-full bg-fuchsia-500/10 blur-xl" />

        {/* aro glow */}
        <div className="absolute h-[64px] w-[64px] rounded-full border border-fuchsia-500/20 shadow-[0_0_18px_rgba(168,85,247,0.35)]" />

        {/* imagen */}
        <img
          src={userImage}
          alt={userName}
          className="relative h-14 w-14 rounded-full object-cover transition-all duration-300 hover:scale-105"
        />

        {/* LED verde (activo) */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.9)] ring-2 ring-[#050507]" />
      </div>

      {/* TEXTO */}
      <div className="flex flex-col justify-center leading-tight">
        
        {/* nombre más pequeño */}
        <p className="truncate text-[1.1rem] font-medium text-white/95">
          {userName}
        </p>

        {/* estado */}
        <span className="text-[0.75rem] text-white/50">
          En línea
        </span>
      </div>
    </div>
  );
}