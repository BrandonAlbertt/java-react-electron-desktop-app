import { useEffect, useMemo, useState } from "react";
import { X, Music, Shield, User, Save, Edit3, ListMusic } from "lucide-react";
import FavoritosList from "./contents/favoritos/FavoritosList";

/*
  ModalPlaylist.jsx

  modal para gestionar playlists.
  tiene dos vistas: usuario y administrador.
  en usuario permite seleccionar una lista y editar su nombre.
*/

export default function ModalPlaylist({
    isOpen = false,
    onClose,
    listas = [],
    onRenombrarLista,
    onEliminarLista,
}) {
    // =============================
    // ESTADOS DEL MODAL
    // =============================
    const [tabActiva, setTabActiva] = useState("usuario");
    const [listasSeleccionadasIds, setListasSeleccionadasIds] = useState([]);
    const [nombreLista, setNombreLista] = useState("");
    const [isWorking, setIsWorking] = useState(false);

    // =============================
    // LISTA SELECCIONADA
    // =============================
    const listaSeleccionadaId = listasSeleccionadasIds[0] || null;

    const listaSeleccionada = useMemo(() => {
        return listas.find((lista) => lista.id === listaSeleccionadaId) || null;
    }, [listas, listaSeleccionadaId]);

    const cantidadCanciones = Array.isArray(listaSeleccionada?.canciones)
        ? listaSeleccionada.canciones.length
        : Number(listaSeleccionada?.canciones || 0);

    // =============================
    // SINCRONIZAR INPUT CON LISTA
    // =============================
    useEffect(() => {
        if (listaSeleccionada) {
            setNombreLista(listaSeleccionada.nombre || "");
        } else {
            setNombreLista("");
        }
    }, [listaSeleccionada]);

    // =============================
    // EVENTOS DE LISTA
    // =============================
    const handleSeleccionarLista = (listaId) => {
        if (isWorking) return;

        // solo permite una lista seleccionada
        setListasSeleccionadasIds([listaId]);
    };

    const handleGuardarCambios = async () => {
        if (!listaSeleccionada || isWorking) return;

        const nuevoNombre = nombreLista.trim();

        if (!nuevoNombre) return;
        if (nuevoNombre === listaSeleccionada.nombre) return;

        try {
            setIsWorking(true);
            const resultado = await onRenombrarLista?.(listaSeleccionada.id, nuevoNombre);
            
            // si la actualización fue exitosa, resetea el estado del input
            if (resultado) {
                // el input se actualizará automáticamente con el nuevo nombre gracias al useEffect
                // y puedeGuardar se desactivará porque nombreLista === listaSeleccionada.nombre
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        } finally {
            setIsWorking(false);
        }
    };

    // =============================
    // VALIDACIONES
    // =============================
    const nombreLimpio = nombreLista.trim();

    const puedeGuardar =
        !!listaSeleccionada &&
        !!nombreLimpio &&
        nombreLimpio !== listaSeleccionada.nombre &&
        !isWorking;

    // =============================
    // CERRAR SI NO ESTA ABIERTO
    // =============================
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-xl">
            <div
                className="
                    relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden
                    rounded-[2rem] border border-fuchsia-500/30
                    bg-[#07030d]/95 shadow-[0_0_80px_rgba(217,70,239,0.22)]
                "
            >
                {/* ============================= */}
                {/* DECORACION DE FONDO */}
                {/* ============================= */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.12),transparent_40%)]" />

                {/* ============================= */}
                {/* CABECERA */}
                {/* ============================= */}
                <header className="relative flex items-center justify-between border-b border-white/10 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                flex h-14 w-14 items-center justify-center rounded-3xl
                                border border-fuchsia-400/40 bg-fuchsia-500/10
                                text-fuchsia-300 shadow-[0_0_28px_rgba(217,70,239,0.25)]
                            "
                        >
                            <Music size={28} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Gestor de playlists
                            </h2>
                            <p className="mt-1 text-sm text-white/45">
                                Edita tus listas musicales
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isWorking}
                        className="
                            flex h-11 w-11 items-center justify-center rounded-2xl
                            border border-fuchsia-500/40 bg-fuchsia-500/10
                            text-white/80 transition hover:bg-fuchsia-500/20 hover:text-white
                            disabled:cursor-wait disabled:opacity-50
                        "
                    >
                        <X size={22} />
                    </button>
                </header>

                {/* ============================= */}
                {/* PESTAÑAS */}
                {/* ============================= */}
                <div className="relative flex justify-center px-8 pt-6">
                    <div
                        className="
                            flex rounded-2xl border border-white/10 bg-black/35 p-1
                            shadow-[inset_0_0_18px_rgba(255,255,255,0.03)]
                        "
                    >
                        <button
                            type="button"
                            onClick={() => setTabActiva("usuario")}
                            className={`flex min-w-40 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition
                                ${tabActiva === "usuario"
                                    ? "bg-fuchsia-500 text-black shadow-[0_0_24px_rgba(217,70,239,0.35)]"
                                    : "text-white/55 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            <User size={18} />
                            Usuario
                        </button>

                        <button
                            type="button"
                            onClick={() => setTabActiva("administrador")}
                            className={`flex min-w-40 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition
                                ${tabActiva === "administrador"
                                    ? "bg-fuchsia-500 text-black shadow-[0_0_24px_rgba(217,70,239,0.35)]"
                                    : "text-white/55 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            <Shield size={18} />
                            Administrador
                        </button>
                    </div>
                </div>

                {/* ============================= */}
                {/* CUERPO DEL MODAL */}
                {/* ============================= */}
                <main className="relative min-h-0 flex-1 overflow-hidden p-8">
                    {tabActiva === "usuario" ? (
                        <div className="grid h-full min-h-[430px] grid-cols-1 gap-7 lg:grid-cols-[1.05fr_1fr]">
                            {/* ============================= */}
                            {/* COLUMNA IZQUIERDA - LISTAS */}
                            {/* ============================= */}
                            <FavoritosList
                                listas={listas}
                                listasSeleccionadasIds={listasSeleccionadasIds}
                                isWorking={isWorking}
                                onSeleccionarLista={handleSeleccionarLista}
                                onEliminarLista={onEliminarLista}
                            />

                            {/* ============================= */}
                            {/* COLUMNA DERECHA - EDICION */}
                            {/* ============================= */}
                            <section className="flex min-h-0 flex-col border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400 sm:text-sm">
                                    Editar nombre de lista
                                </h3>

                                {!listaSeleccionada ? (
                                    <div
                                        className="
                                            flex flex-1 flex-col items-center justify-center rounded-3xl
                                            border border-white/10 bg-white/[0.025] p-8 text-center
                                        "
                                    >
                                        <div
                                            className="
                                                mb-5 flex h-20 w-20 items-center justify-center rounded-full
                                                border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300
                                            "
                                        >
                                            <ListMusic size={36} />
                                        </div>

                                        <h4 className="text-lg font-bold text-white">
                                            Selecciona una lista
                                        </h4>

                                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">
                                            Elige una playlist de la columna izquierda para editar su nombre.
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            flex flex-1 flex-col rounded-3xl border border-fuchsia-500/25
                                            bg-black/25 p-5 shadow-[0_0_35px_rgba(217,70,239,0.10)]
                                        "
                                    >
                                        {/* ============================= */}
                                        {/* CARD DE LISTA SELECCIONADA */}
                                        {/* ============================= */}
                                        <div
                                            className="
                                                flex items-center gap-4 rounded-3xl border border-white/10
                                                bg-white/[0.035] p-4
                                            "
                                        >
                                            <img
                                                src={listaSeleccionada.imagen}
                                                alt={listaSeleccionada.nombre || "Playlist"}
                                                className="
                                                    h-20 w-20 rounded-3xl object-cover
                                                    shadow-[0_0_25px_rgba(217,70,239,0.22)]
                                                "
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                                                    Lista seleccionada
                                                </p>

                                                <h4 className="mt-2 truncate text-xl font-bold text-white">
                                                    {listaSeleccionada.nombre}
                                                </h4>

                                                <p className="mt-1 text-sm text-white/45">
                                                    {cantidadCanciones} canciones
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    hidden h-12 w-12 items-center justify-center rounded-2xl
                                                    border border-fuchsia-500/30 bg-fuchsia-500/10
                                                    text-fuchsia-300 sm:flex
                                                "
                                            >
                                                <Edit3 size={22} />
                                            </div>
                                        </div>

                                        {/* ============================= */}
                                        {/* FORMULARIO */}
                                        {/* ============================= */}
                                        <div className="mt-7">
                                            <label className="mb-3 block text-sm font-semibold text-white/70">
                                                Cambiar nombre de lista
                                            </label>

                                            <input
                                                type="text"
                                                value={nombreLista}
                                                onChange={(e) => setNombreLista(e.target.value)}
                                                disabled={isWorking}
                                                placeholder="Escribe el nuevo nombre..."
                                                className="
                                                    w-full rounded-2xl border border-fuchsia-500/35
                                                    bg-[#090510] px-5 py-4 text-sm font-semibold text-white
                                                    outline-none transition placeholder:text-white/30
                                                    focus:border-fuchsia-400 focus:shadow-[0_0_25px_rgba(217,70,239,0.18)]
                                                    disabled:cursor-wait disabled:opacity-60
                                                "
                                            />

                                            <p className="mt-3 text-xs leading-5 text-white/40">
                                                El nuevo nombre se guardará solo para la playlist seleccionada.
                                            </p>
                                        </div>

                                        {/* ============================= */}
                                        {/* BOTON GUARDAR */}
                                        {/* ============================= */}
                                        <div className="mt-auto pt-7">
                                            <button
                                                type="button"
                                                onClick={handleGuardarCambios}
                                                disabled={!puedeGuardar}
                                                className={`
                                                    flex w-full items-center justify-center gap-3 rounded-2xl
                                                    border px-5 py-4 text-sm font-bold transition
                                                    ${puedeGuardar
                                                        ? "border-fuchsia-400/60 bg-fuchsia-500 text-black shadow-[0_0_30px_rgba(217,70,239,0.28)] hover:scale-[1.01]"
                                                        : "cursor-not-allowed border-white/10 bg-white/[0.035] text-white/30"
                                                    }
                                                `}
                                            >
                                                <Save size={19} />
                                                {isWorking ? "Guardando..." : "Guardar cambios"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        /* ============================= */
                        /* VISTA ADMINISTRADOR TEMPORAL */
                        /* ============================= */
                        <div
                            className="
                                flex min-h-[430px] flex-col items-center justify-center rounded-3xl
                                border border-white/10 bg-white/[0.025] p-8 text-center
                            "
                        >
                            <div
                                className="
                                    mb-5 flex h-20 w-20 items-center justify-center rounded-full
                                    border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300
                                "
                            >
                                <Shield size={38} />
                            </div>

                            <h3 className="text-xl font-bold text-white">
                                Panel administrador
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
                                Aquí luego irán los componentes de administración que me pasarás después.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}