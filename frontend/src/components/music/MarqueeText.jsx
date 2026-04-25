import { useEffect, useRef, useState } from "react";

/*
 * MarqueeText.jsx
 *
 * Muestra texto en una sola línea.
 * - Si el texto cabe en el contenedor: no se mueve.
 * - Si el texto se desborda: activa una animación tipo marquee.
 */
export default function MarqueeText({ text, className = "", speed = 18 }) {
  // 1) Referencias al contenedor y al texto
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  // 2) Estado para controlar si debe desplazarse y cuánto
  const [shouldScroll, setShouldScroll] = useState(false);
  const [distance, setDistance] = useState(0);

  // 3) Medición de overflow (al montar, cambiar texto o redimensionar)
  useEffect(() => {
    const checkOverflow = () => {
      const wrapper = wrapperRef.current;
      const textEl = textRef.current;
      if (!wrapper || !textEl) return;

      const wrapperWidth = wrapper.offsetWidth;
      const textWidth = textEl.scrollWidth;

      // Si el texto es más ancho que el contenedor, activar desplazamiento
      if (textWidth > wrapperWidth) {
        setShouldScroll(true);
        setDistance(textWidth - wrapperWidth + 20); // +20 para separar el final
      } else {
        setShouldScroll(false);
        setDistance(0);
      }
    };

    // Ejecutar medición inicial
    checkOverflow();

    // Recalcular en resize de ventana
    window.addEventListener("resize", checkOverflow);

    // Recalcular cuando cambie el tamaño del wrapper/texto
    const ro = new ResizeObserver(checkOverflow);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    if (textRef.current) ro.observe(textRef.current);

    // Limpieza de listeners/observer al desmontar
    return () => {
      window.removeEventListener("resize", checkOverflow);
      ro.disconnect();
    };
  }, [text]);

  // 4) Duración de animación (mínimo 6s para que no vaya demasiado rápido)
  const duration = Math.max(distance / speed, 6);

  // 5) Render
  return (
    <div ref={wrapperRef} className="overflow-hidden whitespace-nowrap">
      <div
        ref={textRef}
        className={`${className} inline-block pr-5 ${shouldScroll ? "animate-marquee-x" : ""}`}
        style={
          shouldScroll
            ? {
                ["--marquee-distance"]: `-${distance}px`,
                ["--marquee-duration"]: `${duration}s`,
              }
            : undefined
        }
      >
        {text}
      </div>
    </div>
  );
}

/*
 * Uso rapido en un componente padre:
 *
 * import MarqueeText from "./MarqueeText";
 *
 * <MarqueeText
 *   text={song.title}
 *   className="text-lg font-bold text-white"
 *   speed={14}
 * />
 *
 * Condiciones minimas:
 * - text debe ser string o valor renderizable como texto
 * - El contenedor padre debe tener ancho limitado para detectar overflow
 * - Debe existir la clase global animate-marquee-x (y sus keyframes) en CSS
 */