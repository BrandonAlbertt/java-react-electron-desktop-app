/*
  UserProfile.jsx
  
  Muestra el avatar, nombre y estado del usuario en el header
  Click en avatar abre el menu desplegable
  
  TAMAÑOS Y ADAPTABILIDAD:
  - El contenedor principal usa altura fija (h-[90px]) pero es adaptativo en ancho (min-w-[210px])
  - El avatar mantiene proporción 1:1 (64x64px) y no se encoge (shrink-0)
  - El nombre y estado se adaptan al espacio disponible sin ocupar más de lo necesario
*/

export default function UserProfile({ userName, userImage, onToggleMenu }) {
  return (
    <>
      {/* Contenedor principal: se adapta con clamp() */}
      <button
        type="button"
        onClick={onToggleMenu}
        className="
          no-drag flex items-center 
          h-[clamp(90px,8vw,120px)]
          min-w-[clamp(210px,18vw,300px)]
          gap-[clamp(12px,1.2vw,20px)]
          rounded-[clamp(28px,2vw,38px)]
          px-[clamp(16px,1.8vw,28px)]
          transition-all duration-300
          hover:bg-white/4
        "
      >
        {/* Avatar: bloque fijo que no se encoge */}
        <div
          className="
            relative flex shrink-0 items-center justify-center
            h-[clamp(64px,5vw,88px)]
            w-[clamp(64px,5vw,88px)]
          "
        >
          {/* Glow: solo decorativo */}
          <div
            className="
              absolute rounded-full bg-fuchsia-500/10 blur-xl
              h-[clamp(70px,5.5vw,100px)]
              w-[clamp(70px,5.5vw,100px)]
            "
          />

          {/* Borde: marca el tamaño del avatar */}
          <div
            className="
              absolute rounded-full border border-fuchsia-500/30
              shadow-[0_0_18px_rgba(168,85,247,0.35)]
              h-[clamp(64px,5vw,88px)]
              w-[clamp(64px,5vw,88px)]
            "
          />

          {/* Imagen: cambia de tamaño según la pantalla */}
          <img
            src={userImage}
            alt={userName}
            className="
              relative rounded-full object-cover
              h-[clamp(56px,4.4vw,78px)]
              w-[clamp(56px,4.4vw,78px)]
            "
          />

          {/* Estado: se mantiene pegado al avatar */}
          <span
            className="
              absolute rounded-full bg-green-400
              shadow-[0_0_10px_rgba(34,197,94,0.9)]
              ring-2 ring-[#050507]
              bottom-[clamp(4px,0.4vw,8px)]
              right-[clamp(4px,0.4vw,8px)]
              h-[clamp(12px,1vw,16px)]
              w-[clamp(12px,1vw,16px)]
            "
          />
        </div>

        {/* Texto: se ajusta sin romper el layout */}
        <div className="flex min-w-0 flex-col items-start leading-tight">
          {/* Nombre: ancho y fuente dinámicos */}
          <p
            className="
              truncate font-semibold text-white
              max-w-[clamp(110px,10vw,180px)]
              text-[clamp(1.05rem,1.4vw,1.45rem)]
            "
          >
            {userName}
          </p>

          {/* Estado: tamaño menor que el nombre */}
          <span
            className="
              text-white/55
              text-[clamp(0.72rem,0.9vw,0.95rem)]
            "
          >
            En línea
          </span>
        </div>
      </button>
    </>
  );
}