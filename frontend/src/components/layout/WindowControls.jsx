/*
  WindowControls.jsx

  Este componente representa los controles de ventana de la aplicación
  de escritorio.

  Funcionalidades principales:
  - Minimizar la ventana
  - Maximizar o restaurar la ventana
  - Cerrar la ventana
  - Mostrar una marca visual del programa debajo de los controles
  - Abrir el portafolio al hacer clic en la imagen de marca

  Props que recibe:
  - onMinimize → función para minimizar
  - onMaximize → función para maximizar o restaurar
  - onClose → función para cerrar
  - brandImage → imagen o logo del programa
  - portfolioUrl → enlace hacia el portafolio

  Componentes que necesita:
  - No depende de otros componentes

  Nota:
  - Usa la clase personalizada "no-drag" porque estos controles
    deben seguir siendo clickeables dentro del header de Electron.
*/
/*
  WindowControls.jsx

  Controles de ventana para Electron:
  - Minimizar
  - Maximizar
  - Cerrar

  También incluye:
  - Botón/logo flotante elegante
  - Efecto de humo/glow detrás al presionar
  - Apertura de portafolio
*/

/*
  WindowControls.jsx

  Controles de ventana premium para Electron:
  - Minimizar
  - Maximizar
  - Cerrar

  Incluye:
  - Botón/logo elegante
  - Glow/humo detrás al presionar
  - Diseño minimalista tipo software premium
*/

import { useRef, useState } from "react";
import brandImageDefault from "../../assets/logo.png";

export default function WindowControls({
    brandImage,
    portfolioUrl,
}) {

    /* ============================= */
    /* IMAGEN DE MARCA */
    /* ============================= */
    const brand = brandImage ?? brandImageDefault;

    /* ============================= */
    /* ESTADOS */
    /* ============================= */
    const [isPressed, setIsPressed] = useState(false);
    const [showSmoke, setShowSmoke] = useState(false);

    /* ============================= */
    /* REFERENCIAS */
    /* ============================= */
    const smokeTimeoutRef = useRef(null);

    /* ============================= */
    /* CONTROLES ELECTRON */
    /* ============================= */
    const handleMinimize = () => {
        window.electronAPI?.minimize();
    };

    const handleMaximize = () => {
        window.electronAPI?.maximize();
    };

    const handleClose = () => {
        window.electronAPI?.close();
    };

    /* ============================= */
    /* ABRIR PORTAFOLIO */
    /* ============================= */
    const handleOpenPortfolio = () => {
        if (!portfolioUrl) return;

        window.open(portfolioUrl, "_blank");
    };

    /* ============================= */
    /* CLICK BOTÓN MARCA */
    /* ============================= */
    const handleBrandClick = () => {

        /* ACTIVAR HUMO */
        setShowSmoke(true);

        clearTimeout(smokeTimeoutRef.current);

        smokeTimeoutRef.current = setTimeout(() => {
            setShowSmoke(false);
        }, 700);

        /* ABRIR PORTAFOLIO */
        handleOpenPortfolio();
    };

    return (

        <div className="
            no-drag
            flex
            min-w-[155px]
            flex-col
            items-end
            justify-start
            gap-4
            pr-3
            pt-2
        ">

            {/* ============================= */}
            {/* CONTROLES DE VENTANA */}
            {/* ============================= */}
            <div className="
                flex
                items-center
                gap-1
                rounded-full
                border
                border-fuchsia-500/15
                bg-[#09090d]/85
                px-2
                py-1
                shadow-[0_0_18px_rgba(168,85,247,0.10)]
                backdrop-blur-md
            ">

                {/* MINIMIZAR */}
                <button
                    onClick={handleMinimize}
                    className="
                        group
                        flex
                        h-7
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-white/65
                        transition-all
                        duration-300
                        hover:bg-fuchsia-500/10
                        hover:text-white
                    "
                    title="Minimizar"
                >
                    <span className="
                        mb-1
                        text-lg
                        leading-none
                        transition
                        group-hover:scale-110
                    ">
                        —
                    </span>
                </button>

                {/* MAXIMIZAR */}
                <button
                    onClick={handleMaximize}
                    className="
                        group
                        flex
                        h-7
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-white/60
                        transition-all
                        duration-300
                        hover:bg-fuchsia-500/10
                        hover:text-white
                    "
                    title="Maximizar o restaurar"
                >
                    <span className="
                        h-[9px]
                        w-[9px]
                        rounded-[2px]
                        border
                        border-current
                        transition
                        group-hover:scale-110
                    " />
                </button>

                {/* CERRAR */}
                <button
                    onClick={handleClose}
                    className="
                        group
                        flex
                        h-7
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-white/70
                        transition-all
                        duration-300
                        hover:bg-red-500/20
                        hover:text-red-300
                    "
                    title="Cerrar"
                >
                    <span className="
                        text-xl
                        leading-none
                        transition
                        group-hover:scale-110
                    ">
                        ×
                    </span>
                </button>
            </div>

            {/* ============================= */}
            {/* BOTÓN LOGO / MARCA */}
            {/* ============================= */}
            <button
                onClick={handleBrandClick}
                onPointerDown={() => setIsPressed(true)}
                onPointerUp={() => setIsPressed(false)}
                onPointerLeave={() => setIsPressed(false)}
                className={
                    `
                    group
                    relative

                    mr-4
                    mt-1

                    flex
                    h-[52px]
                    w-[52px]

                    items-center
                    justify-center

                    rounded-2xl

                    bg-[#08080d]/95

                    backdrop-blur-md

                    transition-all
                    duration-300
                    ease-out

                    shadow-[0_16px_34px_rgba(0,0,0,0.62),0_0_24px_rgba(168,85,247,0.10)]

                    hover:-translate-y-0.5
                    hover:scale-[1.04]

                    hover:shadow-[0_18px_40px_rgba(0,0,0,0.70),0_0_28px_rgba(34,211,238,0.14)]
                    ` +
                    (
                        isPressed
                            ? " translate-y-[2px] scale-95 "
                            : ""
                    )
                }
                title="Abrir portafolio"
            >

                {/* ============================= */}
                {/* HUMO / GLOW DETRÁS */}
                {/* ============================= */}
                <span
                    aria-hidden="true"
                    className={
                        `
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-[26px]
                        transition-all
                        duration-700
                        ease-out
                        ` +
                        (
                            showSmoke
                                ? " opacity-100 scale-[1.35] "
                                : " opacity-0 scale-90 "
                        )
                    }
                    style={{
                        background: `
                            radial-gradient(
                                circle at center,
                                rgba(168,85,247,0.34) 0%,
                                rgba(168,85,247,0.16) 28%,
                                rgba(34,211,238,0.10) 55%,
                                transparent 82%
                            )
                        `,
                        filter: "blur(22px)",
                    }}
                />

                {/* ============================= */}
                {/* BRILLO INTERNO */}
                {/* ============================= */}
                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-2xl
                        bg-gradient-to-br
                        from-fuchsia-500/10
                        via-transparent
                        to-cyan-400/10
                        opacity-70
                    "
                />

                {/* ============================= */}
                {/* LOGO */}
                {/* ============================= */}
                {brand ? (
                    <img
                        src={brand}
                        alt="Marca del programa"
                        className="
                            relative
                            h-8
                            w-8
                            object-contain

                            drop-shadow-[0_0_12px_rgba(34,211,238,0.22)]

                            transition-transform
                            duration-300

                            group-hover:scale-105
                        "
                    />
                ) : (
                    <span className="
                        relative
                        text-sm
                        font-black
                        tracking-wide
                        text-cyan-300
                    ">
                        BAH
                    </span>
                )}
            </button>
        </div>
    );
}