import { useEffect, useMemo, useRef } from "react";
import { ListPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoritesCarousel({
    // MARK: props
    listas = [],
    listaSeleccionadaId,
    onSeleccionarLista,
    onAbrirGestionListas,
}) {
    // =========================================================
    // ===== REFERENCIAS DEL CARRUSEL ==========================
    // =========================================================
    // guardan el contenedor, objetivo del scroll y animación activa
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);

    // guardan dirección y velocidad cuando el mouse está cerca del borde
    const hoverDirectionRef = useRef(0);
    const hoverSpeedRef = useRef(0);

    // =========================================================
    // ===== DATOS DERIVADOS DE LAS LISTAS =====================
    // =========================================================
    // obtiene la lista activa que se mostrará al centro
    const listaActiva = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId);
    }, [listas, listaSeleccionadaId]);

    // obtiene las listas que se mostrarán en el carrusel lateral
    const listasDelCarousel = useMemo(() => {
        return listas.filter((lista) => lista.id !== listaSeleccionadaId);
    }, [listas, listaSeleccionadaId]);

    // =========================================================
    // ===== FUNCIONES DE ANIMACIÓN DEL SCROLL =================
    // =========================================================
    // anima el movimiento del carrusel poco a poco
    const animateScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const current = container.scrollLeft;

        if (hoverDirectionRef.current !== 0) {
            const maxScroll = container.scrollWidth - container.clientWidth;

            const nextTarget =
                targetScrollRef.current +
                hoverDirectionRef.current * hoverSpeedRef.current;

            targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));
        }

        const diff = targetScrollRef.current - current;

        if (Math.abs(diff) < 0.5 && hoverDirectionRef.current === 0) {
            container.scrollLeft = targetScrollRef.current;
            animationFrameRef.current = null;
            return;
        }

        container.scrollLeft = current + diff * 0.12;

        animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    // asegura que la animación esté corriendo
    const ensureAnimation = () => {
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        }
    };

    // mueve el scroll hacia una posición objetivo
    const startSmoothScroll = (nextTarget) => {
        const container = scrollRef.current;
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;

        targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));

        ensureAnimation();
    };

    // centra visualmente una lista al hacer click
    const centerItem = (element) => {
        const container = scrollRef.current;
        if (!container || !element) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = element.getBoundingClientRect();

        const containerCenter = containerRect.left + containerRect.width / 2;
        const itemCenter = itemRect.left + itemRect.width / 2;

        const diff = itemCenter - containerCenter;

        startSmoothScroll(container.scrollLeft + diff);
    };

    // =========================================================
    // ===== EVENTOS DEL MOUSE Y DEL CARRUSEL ==================
    // =========================================================
    // permite mover el carrusel con la rueda del mouse
    const handleWheel = (e) => {
        e.preventDefault();
        startSmoothScroll(targetScrollRef.current + e.deltaY * 1.15);
    };

    // mueve el carrusel automáticamente al acercar el mouse a los bordes
    const handleMouseMove = (e) => {
        const container = scrollRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        const edgeZone = 110;

        if (x < edgeZone) {
            const intensity = 1 - x / edgeZone;
            hoverDirectionRef.current = -1;
            hoverSpeedRef.current = 3 + intensity * 9;
            ensureAnimation();
            return;
        }

        if (x > width - edgeZone) {
            const intensity = (x - (width - edgeZone)) / edgeZone;
            hoverDirectionRef.current = 1;
            hoverSpeedRef.current = 3 + intensity * 9;
            ensureAnimation();
            return;
        }

        hoverDirectionRef.current = 0;
        hoverSpeedRef.current = 0;
    };

    // detiene el scroll automático cuando el mouse sale
    const handleMouseLeave = () => {
        hoverDirectionRef.current = 0;
        hoverSpeedRef.current = 0;
    };

    // selecciona una lista y la centra en el carrusel
    const handleSeleccionarLista = (e, lista) => {
        centerItem(e.currentTarget);
        onSeleccionarLista?.(lista.id);
    };

    // =========================================================
    // ===== EFECTOS Y LIMPIEZA ================================
    // =========================================================
    // cancela la animación al desmontar el componente
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // =========================================================
    // ===== RENDER DEL COMPONENTE =============================
    // =========================================================
    return (
        <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="relative w-full max-w-[1020px] px-[92px]">
                <div className="relative mx-auto w-full max-w-[920px]">

                    {/* lista activa centrada */}
                    {listaActiva && (
                        <motion.div
                            key={listaActiva.id}
                            layoutId={`lista-${listaActiva.id}`}
                            className="pointer-events-none absolute left-1/2 top-[-12px] z-40 -translate-x-1/2"
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 22,
                            }}
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute h-[156px] w-[156px] rounded-full bg-fuchsia-500/10 blur-2xl" />

                                <div className="absolute h-[146px] w-[146px] rounded-full animate-slow-spin">
                                    <div className="h-full w-full rounded-full border border-fuchsia-500/25" />
                                    <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_22px_rgba(217,70,239,1)]" />
                                </div>

                                <div className="absolute h-[138px] w-[138px] rounded-full border border-violet-500/20 shadow-[0_0_28px_rgba(139,92,246,0.22)]" />

                                <img
                                    src={listaActiva.imagen}
                                    alt={listaActiva.nombre}
                                    className="relative h-32 w-32 rounded-full object-cover ring-2 ring-fuchsia-500/75 shadow-[0_0_34px_rgba(168,85,247,0.38)]"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* carrusel de listas */}
                    <div className="relative rounded-[2rem] border border-fuchsia-500/30 bg-black/95 px-4 py-4">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 rounded-l-[2rem] bg-gradient-to-r from-[#050507] via-[#050507]/90 to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 rounded-r-[2rem] bg-gradient-to-l from-[#050507] via-[#050507]/90 to-transparent" />

                        <div
                            ref={scrollRef}
                            onWheel={handleWheel}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="no-scrollbar flex h-[70px] items-center gap-6 overflow-x-auto overflow-y-hidden px-[96px]"
                        >
                            {listasDelCarousel.map((lista) => {
                                return (
                                    <motion.button
                                        key={lista.id}
                                        type="button"
                                        layoutId={`lista-${lista.id}`}
                                        onClick={(e) => handleSeleccionarLista(e, lista)}
                                        title={lista.nombre}
                                        className="group relative shrink-0 scale-100 opacity-90 transition duration-300 hover:opacity-100"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                        }}
                                    >
                                        <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/15 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />

                                        <img
                                            src={lista.imagen}
                                            alt={lista.nombre}
                                            className="h-20 w-20 rounded-full object-cover transition-all duration-300"
                                        />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* botón para gestionar listas */}
                <button
                    type="button"
                    onClick={onAbrirGestionListas}
                    title="Gestionar listas"
                    className="group absolute right-0 top-1/2 flex h-[50px] w-[74px] -translate-y-1/2 items-center justify-center rounded-full border border-dashed border-fuchsia-500/60 bg-[#0c0c12] text-fuchsia-300 shadow-[0_0_28px_rgba(217,70,239,0.22)] transition duration-300 hover:scale-110 hover:border-fuchsia-400 hover:bg-[#12121a] hover:text-fuchsia-200 hover:shadow-[0_0_38px_rgba(217,70,239,0.45)]"
                >
                    <span className="absolute inset-0 rounded-full bg-fuchsia-500/10 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />
                    <ListPlus size={34} strokeWidth={2.2} className="relative z-10" />
                </button>
            </div>
        </div>
    );
}