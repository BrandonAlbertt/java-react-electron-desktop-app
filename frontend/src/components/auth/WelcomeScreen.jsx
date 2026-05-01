export default function WelcomeScreen({ onStart }) {
    return (
        <div className="flex flex-col items-center justify-center gap-8 text-center">

            {/* Título */}
            <button
                onClick={() => { }}
                className="
          text-[clamp(4rem,8vw,8rem)] 
          font-light tracking-wide text-white
          drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]
        "
            >
                musicBH
            </button>

            {/* Subtitulo */}
            <p className="text-[clamp(1rem,1.5vw,1.4rem)] text-white/70">
                sistema de streaming local de música
            </p>

            {/* Botón */}
            <button
                onClick={onStart}
                className="
          rounded-full border border-fuchsia-400/80 bg-black
          px-16 py-3 text-sm font-bold text-white
          shadow-[0_0_25px_rgba(217,70,239,0.9)]
          transition-all duration-300
          hover:scale-105 hover:bg-fuchsia-500/10
        "
            >
                Logeate para escuchar
            </button>
        </div>
    );
}