import {
    SkipBack,
    SkipForward,
    Play,
    Shuffle,
    Repeat,
    Plus,
    Volume2,
} from "lucide-react";

/*
  PlayerBar.jsx

  Este componente representa la barra inferior del reproductor.

  Funcionalidades principales:
  - Mostrar información de la canción actual
  - Controles de reproducción
  - Barra de progreso
  - Acciones rápidas como mezclar, repetir y agregar
  - Barra de volumen con icono de parlante

  Nota:
  - Se usan iconos de lucide-react para mantener un estilo más limpio
    y acorde al diseño general de la aplicación.

  Verificación e instalación de iconos:
  - Para verificar si está instalado:
    ejecutar en consola → npm list lucide-react
  - Para instalar:
    ejecutar → npm install lucide-react
  -Lo puedes encontrar en -> https://lucide.dev/ y en package.json
*/

export default function PlayerBar() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            {/* CONTENEDOR PRINCIPAL */}
            <div
                className="
                flex h-full w-full max-w-[1400px] items-center justify-between gap-4
                rounded-[1.8rem] border border-fuchsia-500/10 bg-[#050507]
                px-4 md:px-6
                "
            >
                {/* IZQUIERDA - INFO DE LA CANCIÓN */}
                <div className="flex min-w-0 w-[28%] items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-fuchsia-500/10 blur-md" />
                        <img
                            src="https://via.placeholder.com/60"
                            alt="Portada de canción"
                            className="relative h-12 w-12 rounded-full object-cover ring-1 ring-fuchsia-500/20"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            Nombre de canción
                        </p>
                        <p className="truncate text-xs text-white/60">
                            Grupo o artista de canción
                        </p>
                    </div>
                </div>

                {/* CENTRO - CONTROLES Y PROGRESO */}
                <div className="flex max-w-[620px] flex-1 flex-col items-center justify-center gap-2">
                    {/* BOTONES */}
                    <div className="flex items-center gap-5 text-fuchsia-400">
                        <button className="transition hover:scale-110 hover:text-fuchsia-300">
                            <SkipBack size={18} />
                        </button>

                        <button
                            className="
                            flex h-12 w-12 items-center justify-center rounded-full
                            bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(217,70,239,0.35)]
                            transition hover:scale-105 hover:bg-fuchsia-500
                            "
                        >
                            <Play size={18} fill="currentColor" />
                        </button>

                        <button className="transition hover:scale-110 hover:text-fuchsia-300">
                            <SkipForward size={18} />
                        </button>
                    </div>

                    {/* BARRA DE PROGRESO */}
                    <div className="flex w-full items-center gap-2">
                        <span className="text-xs text-white/60">0:00</span>

                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
                        </div>

                        <span className="text-xs text-white/60">3:20</span>
                    </div>
                </div>

                {/* DERECHA - ACCIONES Y VOLUMEN */}
                <div className="flex w-[28%] items-center justify-end gap-3">
                    <button
                        className="
                        flex h-9 w-9 items-center justify-center rounded-lg
                        bg-white/5 text-white/65 transition
                        hover:bg-white/10 hover:text-fuchsia-300
                        "
                        title="Mezclar"
                    >
                        <Shuffle size={16} />
                    </button>

                    <button
                        className="
                        flex h-9 w-9 items-center justify-center rounded-lg
                        bg-white/5 text-white/65 transition
                        hover:bg-white/10 hover:text-fuchsia-300
                        "
                        title="Repetir"
                    >
                        <Repeat size={16} />
                    </button>

                    <button
                        className="
                        flex h-9 w-9 items-center justify-center rounded-lg
                        bg-white/5 text-fuchsia-400 transition
                        hover:bg-white/10 hover:text-fuchsia-300
                        "
                        title="Agregar a favoritos"
                    >
                        <Plus size={18} />
                    </button>

                    {/* VOLUMEN */}
                    <div className="ml-2 flex items-center gap-2">
                        <Volume2 size={17} className="text-white/65" />

                        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}