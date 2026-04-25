import { useEffect, useMemo, useRef } from "react";

/*
  FavoritesCarousel.jsx

  Este componente representa la barra central superior donde se muestran
  las listas favoritas en forma de carrusel horizontal.

  Qué puede hacer este componente:
  - Mostrar varias listas favoritas como círculos con imagen
  - Mantener siempre visible la lista actualmente seleccionada
  - Mover el carrusel con la rueda del mouse
  - Mover el carrusel acercando el cursor a los extremos
  - Permitir seleccionar una lista con clic
  - Mostrar un botón para crear una nueva lista
*/

export default function FavoritesCarousel({
    lists,
    activeListId,
    onSelectList,
    onAddList,
}) {
    /*
      Referencias internas del componente
  
      scrollRef:
      Guarda una referencia directa al contenedor que se desplaza horizontalmente.
  
      targetScrollRef:
      Guarda la posición final hacia donde queremos mover el carrusel.
  
      animationFrameRef:
      Guarda la animación activa para que el desplazamiento sea suave.
  
      hoverDirectionRef:
      Indica hacia qué lado debe moverse el carrusel automáticamente
      cuando el cursor se acerca a un extremo.
      -1 = izquierda
       1 = derecha
       0 = detenido
  
      hoverSpeedRef:
      Guarda la velocidad actual del movimiento automático.
    */
    const scrollRef = useRef(null);
    const targetScrollRef = useRef(0);
    const animationFrameRef = useRef(null);
    const hoverDirectionRef = useRef(0);
    const hoverSpeedRef = useRef(0);

    /*
      Lista activa actual
  
      Aquí buscamos dentro de todas las listas cuál es la que está seleccionada.
      Esa lista será la que se mostrará grande y resaltada en el centro.
    */
    const activeList = useMemo(
        () => lists.find((list) => list.id === activeListId),
        [lists, activeListId]
    );

    /*
      Animación de desplazamiento suave
  
      Esta función mueve poco a poco el carrusel hacia la posición deseada,
      para que no se vea brusco ni a saltos.
    */
    const animateScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const current = container.scrollLeft;
        const target = targetScrollRef.current;
        const diff = target - current;

        if (Math.abs(diff) < 0.5 && hoverDirectionRef.current === 0) {
            container.scrollLeft = target;
            animationFrameRef.current = null;
            return;
        }

        /*
          Movimiento automático por cercanía del cursor a los extremos
    
          Si el cursor está cerca del borde izquierdo o derecho,
          el carrusel seguirá moviéndose automáticamente.
        */
        if (hoverDirectionRef.current !== 0) {
            const maxScroll = container.scrollWidth - container.clientWidth;
            const nextTarget =
                targetScrollRef.current +
                hoverDirectionRef.current * hoverSpeedRef.current;

            targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));
        }

        container.scrollLeft = current + (targetScrollRef.current - current) * 0.12;
        animationFrameRef.current = requestAnimationFrame(animateScroll);
    };

    /*
      Asegurar que la animación comience
  
      Si no hay una animación corriendo, aquí se inicia.
    */
    const ensureAnimation = () => {
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animateScroll);
        }
    };

    /*
      Desplazamiento suave manual
  
      Esta función define un nuevo destino horizontal para el carrusel.
      Luego la animación se encarga de llegar hasta allí suavemente.
    */
    const startSmoothScroll = (nextTarget) => {
        const container = scrollRef.current;
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        targetScrollRef.current = Math.max(0, Math.min(nextTarget, maxScroll));
        ensureAnimation();
    };

    /*
      Movimiento con la rueda del mouse
  
      Cuando el usuario usa la rueda, el carrusel se mueve horizontalmente.
    */
    const handleWheel = (e) => {
        if (!scrollRef.current) return;
        e.preventDefault();
        startSmoothScroll(targetScrollRef.current + e.deltaY * 1.15);
    };

    /*
      Movimiento automático por posición del cursor
  
      Si el cursor se acerca al extremo izquierdo o derecho de la barra,
      el carrusel empieza a desplazarse solo en esa dirección.
  
      Mientras más cerca esté el cursor del borde, más rápido se moverá.
    */
    const handleMouseMove = (e) => {
        const container = scrollRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        const edgeZone = 110; // zona sensible en cada extremo

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

    /*
      Detener movimiento automático
  
      Cuando el cursor sale del carrusel, el movimiento automático se detiene.
    */
    const handleMouseLeave = () => {
        hoverDirectionRef.current = 0;
        hoverSpeedRef.current = 0;
    };

    /*
      Limpieza al desmontar
  
      Si el componente se cierra o se deja de usar,
      cancelamos la animación para evitar errores o consumo innecesario.
    */
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);



    /* EN ESTA PARTE SE RENDERIZA TODO EL COMPONENTE */
    /* EN ESTA PARTE SE RENDERIZA TODO EL COMPONENTE */
    /* EN ESTA PARTE SE RENDERIZA TODO EL COMPONENTE */




    return (
        <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="relative w-full max-w-[820px]">

                {/* 
          Vista destacada de la lista seleccionada

          Esta es la portada grande que aparece centrada y resaltada.
          Está separada visualmente del resto para que siempre se mantenga visible.
        */}
                {activeList && (
                    <div
                        key={activeList.id}
                        className="pointer-events-none absolute left-1/2 top-[-12px] z-40 -translate-x-1/2 animate-active-pop-in"
                    >
                        <div className="relative flex items-center justify-center">

                            {/* Luz difusa del fondo */}
                            <div className="absolute h-[156px] w-[156px] rounded-full bg-fuchsia-500/10 blur-2xl" />

                            {/* Aro neon girando lentamente */}
                            <div className="absolute h-[146px] w-[146px] rounded-full animate-slow-spin">
                                <div className="h-full w-full rounded-full border border-fuchsia-500/25" />
                                <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_22px_rgba(217,70,239,1)]" />
                            </div>

                            {/* Aro fijo exterior */}
                            <div className="absolute h-[138px] w-[138px] rounded-full border border-violet-500/20 shadow-[0_0_28px_rgba(139,92,246,0.22)]" />

                            {/* Imagen principal de la lista activa */}
                            <img
                                src={activeList.cover}
                                alt={activeList.name}
                                className="relative h-32 w-32 rounded-full object-cover ring-2 ring-fuchsia-500/75 shadow-[0_0_34px_rgba(168,85,247,0.38)]"
                            />
                        </div>
                    </div>
                )}

                {/*
          Nombre de la lista seleccionada

          Esta parte está comentada porque actualmente se decidió no mostrar
          el nombre debajo del círculo activo.
        */}
                {/*
        {activeList && (
          <div className="pointer-events-none absolute left-1/2 top-[104px] z-30 -translate-x-1/2">
            <p className="rounded-full bg-black/72 px-5 py-1 text-xl font-semibold text-white shadow-lg backdrop-blur-sm">
              {activeList.name}
            </p>
          </div>
        )}
        */}

                {/*
          Contenedor visual principal del carrusel

          Aquí vive la barra negra con bordes redondeados donde se desplazan
          las listas pequeñas.
        */}
                <div className="relative rounded-[2rem] border border-fuchsia-500/30 bg-black/95 px-4 py-4">

                    {/* Difuminado del lado izquierdo */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 rounded-l-[2rem] bg-gradient-to-r from-[#050507] via-[#050507]/90 to-transparent" />

                    {/* Difuminado del lado derecho */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 rounded-r-[2rem] bg-gradient-to-l from-[#050507] via-[#050507]/90 to-transparent" />

                    {/*
            Zona desplazable horizontal

            Esta es la parte que realmente se mueve cuando el usuario usa
            la rueda del mouse o acerca el cursor a los extremos.
          */}
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
                                <button
                                    key={list.id}
                                    onClick={() => onSelectList?.(list)}
                                    className={`group relative shrink-0 transition duration-300 ${isActive
                                            ? "pointer-events-none opacity-0"
                                            : "scale-100 hover:scale-110"
                                        }`}
                                >
                                    {/* Brillo suave al pasar el mouse */}
                                    <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/15 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />

                                    {/* Imagen de cada lista */}
                                    <img
                                        src={list.cover}
                                        alt={list.name}
                                        className="h-20 w-20 rounded-full object-cover opacity-90 transition-all duration-300"
                                    />
                                </button>
                            );
                        })}

                        {/*
              Botón para crear una nueva lista favorita
            */}
                        <button
                            onClick={onAddList}
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-fuchsia-500/50 bg-[#0c0c12] text-4xl text-fuchsia-400 transition hover:scale-110 hover:bg-[#12121a]"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


/*
  Estilos y ajustes personalizados que NO pertenecen a Tailwind CSS

  En este archivo se agregan reglas especiales que Tailwind no trae listas
  como clases directas, o que pertenecen a comportamientos propios de Electron
  y animaciones personalizadas del proyecto.

  Aquí se encuentran, por ejemplo:

  1. Clases para mover la ventana en Electron
     - .drag-region
     - .no-drag

     Estas clases usan la propiedad:
     -webkit-app-region

     Sirven para definir qué parte de la interfaz permite arrastrar la ventana
     y qué parte debe seguir siendo interactiva para botones, inputs y clics.

  2. Ocultar barras de scroll nativas
     - .no-scrollbar

     Esta clase se usa para esconder visualmente la barra del scroll,
     manteniendo el desplazamiento funcional.

  3. Animaciones personalizadas
     - @keyframes slow-spin
     - @keyframes active-pop-in
     - .animate-slow-spin
     - .animate-active-pop-in

     Estas animaciones se usan para efectos visuales del carrusel,
     como el aro neon girando o la entrada suave del elemento activo.

  4. Ajustes globales de la aplicación
     - html, body, #root
     - overflow: hidden
     - box-sizing
     - fondo general

     Estos estilos ayudan a que la aplicación se comporte como una ventana
     de escritorio y no como una página web con scroll global.

  En resumen:
  Tailwind se usa para la mayoría del diseño visual,
  y este archivo index.css complementa el proyecto con comportamientos
  especiales, animaciones propias y soporte para Electron.
*/