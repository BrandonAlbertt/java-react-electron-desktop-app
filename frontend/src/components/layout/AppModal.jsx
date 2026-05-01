import { X, Music, Settings, Upload } from "lucide-react";

function AppModal({ type, onClose }) {
    if (!type) return null;

    const isAddMusic = type === "addMusic";
    const isSettings = type === "settings";

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            {/* Fondo difuminado */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/65 backdrop-blur-md"
            />

            {/* Ventana */}
            <div className="relative z-10 w-[520px] max-w-[90vw] rounded-[32px] border border-fuchsia-500/40 bg-[#09090d]/95 shadow-[0_0_60px_rgba(217,0,255,0.25)] overflow-hidden">

                {/* Glow superior */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-fuchsia-400/80 shadow-[0_0_25px_#d946ef]" />

                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30">
                            {isAddMusic && <Music className="text-fuchsia-300" size={22} />}
                            {isSettings && <Settings className="text-fuchsia-300" size={22} />}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {isAddMusic && "Agregar música"}
                                {isSettings && "Configuración"}
                            </h2>
                            <p className="text-sm text-white/45">
                                {isAddMusic && "Añade una canción a tu biblioteca"}
                                {isSettings && "Personaliza tu cuenta"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-white/50 hover:text-white hover:bg-white/10 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Contenido dinámico */}
                <div className="px-7 py-6">
                    {isAddMusic && <AddMusicContent />}
                    {isSettings && <SettingsContent />}
                </div>
            </div>
        </div>
    );
}

function AddMusicContent() {
    return (
        <div className="space-y-5">
            <label className="block">
                <span className="text-sm text-fuchsia-300">Nombre de la canción</span>
                <input
                    type="text"
                    placeholder="Ejemplo: Dark Moon"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-fuchsia-400"
                />
            </label>

            <label className="block">
                <span className="text-sm text-fuchsia-300">Grupo o artista</span>
                <input
                    type="text"
                    placeholder="Ejemplo: Age Sha"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-fuchsia-400"
                />
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-fuchsia-400/40 bg-fuchsia-500/5 py-8 hover:bg-fuchsia-500/10 transition">
                <Upload className="mb-2 text-fuchsia-300" />
                <span className="text-white font-semibold">Subir archivo de audio</span>
                <span className="text-sm text-white/40">MP3, WAV o M4A</span>
                <input type="file" className="hidden" />
            </label>

            <button className="w-full rounded-2xl bg-fuchsia-600 py-3 font-bold text-white shadow-[0_0_25px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500 transition">
                Guardar música
            </button>
        </div>
    );
}

function SettingsContent() {
    return (
        <div className="space-y-4">
            <button className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white hover:bg-fuchsia-500/20 transition">
                Editar perfil
            </button>

            <button className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white hover:bg-fuchsia-500/20 transition">
                Cambiar avatar
            </button>

            <button className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white hover:bg-fuchsia-500/20 transition">
                Preferencias de reproducción
            </button>

            <button className="w-full rounded-2xl bg-red-500/15 px-5 py-4 text-left text-red-300 hover:bg-red-500/25 transition">
                Cerrar sesión
            </button>
        </div>
    );
}

export default AppModal;