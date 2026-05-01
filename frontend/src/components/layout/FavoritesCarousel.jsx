// IMPORTS
// importaciones necesarias: react para hooks, lucide-react para iconos, framer-motion para animaciones
import { useEffect, useMemo, useRef } from "react";
import { ListPlus } from "lucide-react";
import { motion } from "framer-motion";

// COMPONENTO PRINCIPAL
// componente que renderiza el carrusel de listas favoritas.
// props: lists (array de listas), activeListId (id de la lista activa),
// onSelectList (callback al seleccionar), onAddList (callback para el botón)
export default function FavoritesCarousel({
    lists = [],
    activeListId,
    onSelectList,
    onAddList,
}) {
    // REFERENCIAS Y ESTADO LOCAL (sin estado reactivo)
    // referencias DOM y valores que persisten entre renderizados
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);
    const hoverDirectionRef = useRef(0);
    const hoverSpeedRef = useRef(0);

    // memoriza la lista activa buscándola por id en el array de listas
    const activeList = useMemo(
        () => lists.find((list) => list.id === activeListId),
        [lists, activeListId]
    );

    // ANIMACIÓN DE SCROLL
    // función que realiza el desplazamiento suave hacia targetScrollRef.current
    // y aplica desplazamiento continuo cuando el ratón está en los bordes
    const animateScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const current = container.scrollLeft;
        const diff = targetScrollRef.current - current;

        if (Math.abs(diff) < 0.5 && hoverDirectionRef.current === 0) {
            container.scrollLeft = targetScrollRef.current;
            animationFrameRef.current = null;
            return;
        }

        if (hoverDirectionRef.current !== 0) {
            const maxScroll = container.scrollWidth - container.clientWidth;

            const nextTarget =
                targetScrollRef.current +
                hoverDirectionRef.current * hoverSpeedRef.current;

            targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));
        }

        container.scrollLeft =
            current + (targetScrollRef.current - current) * 0.12;

        animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    // GESTIÓN DEL FRAME DE ANIMACIÓN
    // inicia requestAnimationFrame si no hay uno en curso
    const ensureAnimation = () => {
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        }
    };

    // INICIAR SCROLL SUAVE
    // establece el objetivo de desplazamiento y asegura que la animación corra
    const startSmoothScroll = (nextTarget) => {
        const container = scrollRef.current;
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;

        targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));

        ensureAnimation();
    };

    // CENTRAR UN ELEMENTO
    // calcula la diferencia entre el centro del contenedor y el centro del item
    // y solicita un desplazamiento suave para colocarlo en el centro
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

    // MANEJADOR DE WHEEL
    // intercepta la rueda del ratón para desplazar horizontalmente el carrusel
    const handleWheel = (e) => {
        if (!scrollRef.current) return;

        e.preventDefault();

        startSmoothScroll(targetScrollRef.current + e.deltaY * 1.15);
    };

    // MANEJADOR DE MOUSE MOVE
    // detecta si el cursor está cerca de los bordes del track para iniciar scroll continuo
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

    // MANEJADOR CUANDO EL MOUSE SALE DEL TRACK
    // detiene el desplazamiento automático
    const handleMouseLeave = () => {
        hoverDirectionRef.current = 0;
        hoverSpeedRef.current = 0;
    };

    // LIMPIEZA AL DESTRUIR
    // cancela cualquier animation frame pendiente cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // RENDERIZADO
    // contenedor principal: centra el contenido del header y limita el ancho
    return (
        <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="relative w-full max-w-[1020px] px-[92px]">
                <div className="relative mx-auto w-full max-w-[920px]">
                    {/* ACTIVE ITEM (IMAGEN CENTRAL) */}
                    {/* si hay una lista activa, renderiza el avatar grande con animaciones */}
                    {activeList && (
                        <motion.div
                            key={activeList.id}
                            layoutId={`favorite-list-${activeList.id}`}
                            className="pointer-events-none absolute left-1/2 top-[-12px] z-40 -translate-x-1/2"
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 22,
                            }}
                        >
                            <div className="relative flex items-center justify-center">
                                {/* fondos y anillos decorativos alrededor de la imagen activa */}
                                <div className="absolute h-[156px] w-[156px] rounded-full bg-fuchsia-500/10 blur-2xl" />

                                <div className="absolute h-[146px] w-[146px] rounded-full animate-slow-spin">
                                    <div className="h-full w-full rounded-full border border-fuchsia-500/25" />
                                    <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_22px_rgba(217,70,239,1)]" />
                                </div>

                                <div className="absolute h-[138px] w-[138px] rounded-full border border-violet-500/20 shadow-[0_0_28px_rgba(139,92,246,0.22)]" />

                                {/* imagen de la lista activa */}
                                <img
                                    src={activeList.cover}
                                    alt={activeList.name}
                                    className="relative h-32 w-32 rounded-full object-cover ring-2 ring-fuchsia-500/75 shadow-[0_0_34px_rgba(168,85,247,0.38)]"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* TRACK DEL CARRUSEL */}
                    {/* contenedor con fondo y degradados en los laterales para efecto de máscara */}
                    <div className="relative rounded-[2rem] border border-fuchsia-500/30 bg-black/95 px-4 py-4">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 rounded-l-[2rem] bg-gradient-to-r from-[#050507] via-[#050507]/90 to-transparent" />

                        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 rounded-r-[2rem] bg-gradient-to-l from-[#050507] via-[#050507]/90 to-transparent" />

                        {/* BANDA HORIZONTAL SCROLLABLE */}
                        {/* aquí se mapean las miniaturas; es scrollable horizontalmente */}
                        <div
                            ref={scrollRef}
                            onWheel={handleWheel}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="no-scrollbar flex h-[70px] items-center gap-6 overflow-x-auto overflow-y-hidden px-[96px]"
                        >
                            {lists.map((list) => {
                                const isActive = list.id === activeListId;

                                return (
                                    <motion.button
                                        key={list.id}
                                        type="button"
                                        layoutId={`favorite-list-${list.id}`}
                                        onClick={(e) => {
                                            // al clicar, centra el elemento y notifica al padre
                                            centerItem(e.currentTarget);

                                            setTimeout(() => {
                                                onSelectList?.(list);
                                            }, 120);
                                        }}
                                        title={list.name}
                                        className={`group relative shrink-0 transition duration-300 ${isActive
                                                ? "pointer-events-none opacity-0 scale-75"
                                                : "scale-100"
                                            }`}
                                        whileHover={!isActive ? { scale: 1.1 } : undefined}
                                        whileTap={!isActive ? { scale: 0.95 } : undefined}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                        }}
                                    >
                                        <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/15 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />

                                        {/* miniatura de cada lista */}
                                        <img
                                            src={list.cover}
                                            alt={list.name}
                                            className="h-20 w-20 rounded-full object-cover opacity-90 transition-all duration-300"
                                        />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* BOTÓN AGREGAR / GESTIONAR */}
                {/* botón posicionado en absoluto a la derecha para no afectar el centrado del track */}
                <button
                    type="button"
                    onClick={onAddList}
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