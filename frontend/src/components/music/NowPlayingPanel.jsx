import { useEffect, useRef, useState } from "react";

/*
  NowPlayingPanel.jsx
*/

export default function NowPlayingPanel() {
  const [showLyrics, setShowLyrics] = useState(false);
  const contentRef = useRef(null);
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  // ESTADO DE REPRODUCCIÓN (entrada principal del componente).
  // Aquí "pasas" si hay música activa: true = reproduciendo, false = sin reproducción.
  // Cuando lo conectes al reproductor real, reemplaza esta constante por tu estado global/prop.
  const hasSong = true;;

  const currentSong = hasSong
    ? {
        title: "Nombre de canción",
        artist: "Grupo o artista",
        composer: "Compositor o autor",
        genres: "Rock · Indie · Alternativo",
        lyrics: `Con diez cañones por banda,
viento en popa a toda vela,
no corta el mar, sino vuela
un velero bergantín;`,
        image: "https://i.imgur.com/8Km9tLL.jpeg",
      }
    : null;

  const checkScrollState = () => {
    const el = contentRef.current;
    if (!el) return;

    const hasMoreBelow = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
    setShowBottomArrow(hasMoreBelow);
  };

  const handleScrollDown = () => {
    const el = contentRef.current;
    if (!el) return;

    el.scrollBy({
      top: 180,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScrollState();

    const el = contentRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);

    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [showLyrics, hasSong]);

  return (
    <section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-fuchsia-500/20 bg-[#07070b] p-3 text-white sm:p-4">
      {/* HEADER */}
      <div className="mb-2 flex shrink-0 items-center justify-between sm:mb-3">
        <div className="flex items-center gap-2">
          {/* hasSong controla el color del indicador de estado */}
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              hasSong
                ? "bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.9)]"
                : "bg-orange-900 shadow-[0_0_8px_rgba(124,45,18,0.45)]"
            }`}
          />
          {/* hasSong también define el texto de estado */}
          <p className="text-[clamp(0.68rem,0.9vw,0.9rem)] font-medium uppercase tracking-[0.12em] text-white/72">
            {hasSong ? "En reproducción" : "Sin reproducción"}
          </p>
        </div>

        {/* hasSong habilita o deshabilita el micrófono */}
        <button
          onClick={() => {
            if (hasSong) {
              setShowLyrics((prev) => !prev);
            }
          }}
          disabled={!hasSong}
          className={`
            group flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 sm:h-8 sm:w-8
            ${
              !hasSong
                ? "cursor-not-allowed border-white/5 bg-white/[0.03] text-white/20"
                : showLyrics
                ? "border-green-400/45 bg-green-500/10 text-green-300 shadow-[0_0_16px_rgba(74,222,128,0.25)]"
                : "border-white/10 bg-white/5 text-white/55 hover:border-green-400/35 hover:bg-green-500/10 hover:text-green-300"
            }
          `}
          title={
            !hasSong
              ? "Micrófono desactivado"
              : showLyrics
              ? "Volver a información"
              : "Mostrar letra"
          }
        >
          <span className="text-xs sm:text-sm">🎤</span>
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={contentRef}
          className="no-scrollbar h-full overflow-y-auto pb-20"
        >
          {/* ESTADO VACÍO: se muestra cuando hasSong es false */}
          {!hasSong && (
            <div className="flex min-h-full items-center justify-center">
              <div className="flex w-full max-w-md flex-col items-center justify-center rounded-[1.8rem] border border-fuchsia-500/10 bg-gradient-to-b from-[#0b0b10]/80 to-[#07070b]/60 px-6 py-10 text-center backdrop-blur-md">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-orange-900/40 bg-orange-950/20 text-3xl text-orange-800">
                  ♪
                </div>

                <p className="text-[clamp(0.95rem,1.2vw,1.2rem)] font-semibold text-white/88">
                  Reproduzca una canción
                </p>

                <p className="mt-2 text-[0.82rem] text-white/45">
                  Aquí se mostrará la información cuando haya música activa.
                </p>
              </div>
            </div>
          )}

          {/* VISTA INFORMACIÓN: solo cuando hasSong es true */}
          {hasSong && !showLyrics && (
            <div className="flex min-h-full flex-col">
              <div className="mb-3 flex shrink-0 justify-center sm:mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-fuchsia-500/12 blur-2xl" />
                  <img
                    src={currentSong.image}
                    alt={currentSong.title}
                    className="relative h-24 w-24 rounded-full object-cover ring-1 ring-fuchsia-500/20 shadow-[0_0_24px_rgba(168,85,247,0.14)] sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
                  />
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-fuchsia-500/10 bg-gradient-to-b from-[#0b0b10]/80 to-[#07070b]/60 backdrop-blur-md px-4 py-4">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <CompactInfoBlock
                    label="Canción"
                    value={currentSong.title}
                    strong
                  />
                  <CompactInfoBlock label="Grupo" value={currentSong.artist} />
                  <CompactInfoBlock
                    label="Compositor"
                    value={currentSong.composer}
                  />
                  <CompactInfoBlock label="Géneros" value={currentSong.genres} />
                </div>

                <div className="min-h-0 flex-1" />
              </div>
            </div>
          )}

          {/* VISTA LETRA: solo cuando hasSong es true */}
          {hasSong && showLyrics && (
            <div className="flex min-h-full flex-col">
              <div className="mb-2 shrink-0 sm:mb-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-fuchsia-400/75 sm:text-[0.7rem]">
                  Letra
                </p>
              </div>

              <div className="flex min-h-0 flex-1 flex-col rounded-[1.5rem] border border-fuchsia-500/10 bg-gradient-to-b from-[#0b0b10]/80 to-[#07070b]/60 backdrop-blur-md px-3 py-3 shadow-inner sm:rounded-[1.8rem] sm:px-4 sm:py-4">
                <div className="rounded-[1.2rem] bg-[#0b0b10] px-3 py-3 sm:rounded-[1.3rem] sm:px-4 sm:py-4">
                  <p className="whitespace-pre-line text-center text-[clamp(0.76rem,1vw,1rem)] leading-6 text-white/85 sm:leading-7">
                    {currentSong.lyrics}
                  </p>
                </div>

                <div className="min-h-0 flex-1" />
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[2rem] bg-gradient-to-t from-[#07070b] via-[#07070b]/88 to-transparent" />

        {hasSong && showBottomArrow && (
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
            <button
              onClick={handleScrollDown}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-red-500/35 bg-black/55 backdrop-blur-sm transition duration-300 hover:scale-105 hover:border-red-400/60"
              title="Ver más información"
            >
              <span className="text-[2.2rem] leading-none text-red-500 transition group-hover:text-red-400">
                ▽
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function CompactInfoBlock({ label, value, strong = false }) {
  return (
    <div className="rounded-[0.95rem] bg-[#0b0b10] px-3 py-2 sm:rounded-[1rem] sm:px-3 sm:py-2.5">
      <p className="mb-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-fuchsia-400/75 sm:text-[0.62rem]">
        {label}
      </p>

      <p
        className={`
          break-words leading-snug text-white
          ${
            strong
              ? "text-[clamp(0.82rem,1.2vw,1.2rem)] font-bold"
              : "text-[clamp(0.72rem,0.95vw,0.92rem)] font-medium text-white/82"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}