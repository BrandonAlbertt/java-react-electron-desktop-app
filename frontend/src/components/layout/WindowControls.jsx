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

export default function WindowControls({
    brandImage,
    portfolioUrl,
}) {
    const handleMinimize = () => {
        window.electronAPI?.minimize();
    };

    const handleMaximize = () => {
        window.electronAPI?.maximize();
    };

    const handleClose = () => {
        window.electronAPI?.close();
    };

    const handleOpenPortfolio = () => {
        if (!portfolioUrl) return;
        window.open(portfolioUrl, "_blank");
    };

    return (
        <div className="no-drag flex min-w-[120px] flex-col items-end justify-start gap-3">

            {/* CONTROLES DE VENTANA */}
            <div className="flex items-center gap-1 rounded-full border border-fuchsia-500/20 bg-[#09090d]/80 px-2 py-1 shadow-[0_0_18px_rgba(168,85,247,0.12)] backdrop-blur-md">

                <button
                    onClick={handleMinimize}
                    className="group flex h-7 w-9 items-center justify-center rounded-full text-white/65 transition-all duration-300 hover:bg-fuchsia-500/10 hover:text-white"
                    title="Minimizar"
                >
                    <span className="mb-1 text-lg leading-none transition group-hover:scale-110">
                        —
                    </span>
                </button>

                <button
                onClick={handleMaximize}
                className="group flex h-7 w-9 items-center justify-center rounded-full text-white/60 transition-all duration-300 hover:bg-fuchsia-500/10 hover:text-white"
                title="Maximizar o restaurar"
                >
                <span className="h-[9px] w-[9px] rounded-[2px] border border-current transition group-hover:scale-110" />
                </button>

                <button
                    onClick={handleClose}
                    className="group flex h-7 w-9 items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:bg-red-500/20 hover:text-red-300"
                    title="Cerrar"
                >
                    <span className="text-xl leading-none transition group-hover:scale-110">
                        ×
                    </span>
                </button>
            </div>

            {/* MARCA DEL PROGRAMA */}
            <button
                onClick={handleOpenPortfolio}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/25 bg-[#0b0b12]/90 text-fuchsia-300 shadow-[0_0_16px_rgba(168,85,247,0.12)] transition-all duration-300 hover:scale-105 hover:border-fuchsia-400/45 hover:bg-fuchsia-500/10"
                title="Abrir portafolio"
            >
                <div className="absolute inset-0 rounded-xl bg-fuchsia-500/10 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

                {brandImage ? (
                    <img
                        src={brandImage}
                        alt="Marca del programa"
                        className="relative h-6 w-6 rounded-md object-cover"
                    />
                ) : (
                    <span className="relative text-xs font-black tracking-wide">
                        BB
                    </span>
                )}
            </button>
        </div>
    );
}