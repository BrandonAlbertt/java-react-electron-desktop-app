import { useEffect, useMemo, useState } from "react";
import { Music, Shield, User, X } from "lucide-react";
import GestionGrupoAndMusica from "./contents/gestion/GestionGrupoAndMusica";
import EditListas from "./contents/favoritos/EditListas";

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
    grupos = [],
    generos = [],
    onGuardarMusica = () => {},
    tabInicial = "usuario",
}) {
    const [tabActiva, setTabActiva] = useState(tabInicial);
    const [listasSeleccionadasIds, setListasSeleccionadasIds] = useState([]);
    const [nombreLista, setNombreLista] = useState("");
    const [isWorking, setIsWorking] = useState(false);

    const listaSeleccionadaId = listasSeleccionadasIds[0] || null;

    const listaSeleccionada = useMemo(
        () => listas.find((lista) => lista.id === listaSeleccionadaId) || null,
        [listas, listaSeleccionadaId]
    );

    useEffect(() => {
        if (listaSeleccionada) {
            setNombreLista(listaSeleccionada.nombre || "");
        } else {
            setNombreLista("");
        }
    }, [listaSeleccionada]);

    useEffect(() => {
        if (isOpen) {
            setTabActiva(tabInicial);
        }
    }, [isOpen, tabInicial]);

    const handleSeleccionarLista = (listaId) => {
        if (isWorking) return;

        setListasSeleccionadasIds([listaId]);
    };

    const handleGuardarCambios = async () => {
        if (!listaSeleccionada || isWorking) return;

        const nuevoNombre = nombreLista.trim();

        if (!nuevoNombre || nuevoNombre === listaSeleccionada.nombre) return;

        try {
            setIsWorking(true);
            await onRenombrarLista?.(listaSeleccionada.id, nuevoNombre);
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        } finally {
            setIsWorking(false);
        }
    };

    const nombreLimpio = nombreLista.trim();
    const puedeGuardar =
        !!listaSeleccionada &&
        !!nombreLimpio &&
        nombreLimpio !== listaSeleccionada.nombre &&
        !isWorking;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-4 backdrop-blur-xl">
            <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-4xl border border-fuchsia-500/30 bg-[#07030d]/95 shadow-[0_0_80px_rgba(217,70,239,0.22)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.12),transparent_40%)]" />

                <header className="relative flex items-center justify-between border-b border-white/10 px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_28px_rgba(217,70,239,0.25)]">
                            <Music size={28} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">Gestor de playlists</h2>
                            <p className="mt-1 text-sm text-white/45">Edita tus listas musicales</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isWorking}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-500/40 bg-fuchsia-500/10 text-white/80 transition hover:bg-fuchsia-500/20 hover:text-white disabled:cursor-wait disabled:opacity-50"
                    >
                        <X size={22} />
                    </button>
                </header>

                <div className="relative flex justify-center px-8 pt-5">
                    <div className="flex rounded-2xl border border-white/10 bg-black/35 p-1 shadow-[inset_0_0_18px_rgba(255,255,255,0.03)]">
                        <button
                            type="button"
                            onClick={() => setTabActiva("usuario")}
                            className={`flex min-w-40 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                                tabActiva === "usuario"
                                    ? "bg-fuchsia-500 text-black shadow-[0_0_24px_rgba(217,70,239,0.35)]"
                                    : "text-white/55 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <User size={18} />
                            Usuario
                        </button>

                        <button
                            type="button"
                            onClick={() => setTabActiva("administrador")}
                            className={`flex min-w-40 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                                tabActiva === "administrador"
                                    ? "bg-fuchsia-500 text-black shadow-[0_0_24px_rgba(217,70,239,0.35)]"
                                    : "text-white/55 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Shield size={18} />
                            Administrador
                        </button>
                    </div>
                </div>

                <main className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto p-6 lg:p-7">
                    {tabActiva === "usuario" ? (
                        <EditListas
                            listas={listas}
                            onSeleccionar={handleSeleccionarLista}
                            listaSeleccionadaId={listaSeleccionadaId}
                            onRenombrarLista={onRenombrarLista}
                            onEliminarLista={onEliminarLista}
                            listasSeleccionadasIds={listasSeleccionadasIds}
                            nombreLista={nombreLista}
                            onNombreListaChange={setNombreLista}
                            onGuardar={handleGuardarCambios}
                            isWorking={isWorking}
                            puedeGuardar={puedeGuardar}
                        />
                    ) : (
                        <div className="min-h-0 rounded-3xl border border-white/10 bg-white/2.5 p-5 text-center lg:p-6">
                            <GestionGrupoAndMusica
                                grupos={grupos}
                                generos={generos}
                                onGuardarMusica={onGuardarMusica}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
