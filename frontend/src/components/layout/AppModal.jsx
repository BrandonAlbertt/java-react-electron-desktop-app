import { X, Music, Settings, Upload, ListPlus } from "lucide-react";

function AppModal({ type, onClose }) {
    if (!type) return null;

    const isAddMusic = type === "addMusic";
    const isSettings = type === "settings";
    const isGestionLista = type === "gestionLista";

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/65 backdrop-blur-md"
            />

            <div className="relative z-10 w-[520px] max-w-[90vw] overflow-hidden rounded-[32px] border border-fuchsia-500/40 bg-[#09090d]/95 shadow-[0_0_60px_rgba(217,0,255,0.25)]">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-fuchsia-400/80 shadow-[0_0_25px_#d946ef]" />

                <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/15">
                            {isAddMusic && <Music className="text-fuchsia-300" size={22} />}
                            {isSettings && <Settings className="text-fuchsia-300" size={22} />}
                            {isGestionLista && <ListPlus className="text-fuchsia-300" size={22} />}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {isAddMusic && "Agregar musica"}
                                {isSettings && "Configuracion"}
                                {isGestionLista && "Gestionar listas"}
                            </h2>
                            <p className="text-sm text-white/45">
                                {isAddMusic && "Anade una cancion a tu biblioteca"}
                                {isSettings && "Personaliza tu cuenta"}
                                {isGestionLista && "Crea o edita tus listas favoritas"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="px-7 py-6">
                    {isAddMusic && <AddMusicContent />}
                    {isSettings && <SettingsContent />}
                    {isGestionLista && <GestionListaContent />}
                </div>
            </div>
        </div>
    );
}

function GestionListaContent() {
    return (
        <div className="space-y-5">
            <label className="block">
                <span className="text-sm text-fuchsia-300">Nombre de la lista</span>
                <input
                    type="text"
                    placeholder="Ejemplo: Favoritas de noche"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-fuchsia-400"
                />
            </label>

            <label className="block">
                <span className="text-sm text-fuchsia-300">Imagen de portada</span>
                <input
                    type="text"
                    placeholder="URL de la imagen"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-fuchsia-400"
                />
            </label>

            <button
                type="button"
                className="w-full rounded-2xl bg-fuchsia-600 py-3 font-bold text-white shadow-[0_0_25px_rgba(217,70,239,0.45)] transition hover:bg-fuchsia-500"
            >
                Guardar lista
            </button>
        </div>
    );
}

function AddMusicContent() {
    return (
        <div className="space-y-5">
            <label className="block">
                <span className="text-sm text-fuchsia-300">Nombre de la cancion</span>
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

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-fuchsia-400/40 bg-fuchsia-500/5 py-8 transition hover:bg-fuchsia-500/10">
                <Upload className="mb-2 text-fuchsia-300" />
                <span className="font-semibold text-white">Subir archivo de audio</span>
                <span className="text-sm text-white/40">MP3, WAV o M4A</span>
                <input type="file" className="hidden" />
            </label>

            <button
                type="button"
                className="w-full rounded-2xl bg-fuchsia-600 py-3 font-bold text-white shadow-[0_0_25px_rgba(217,70,239,0.45)] transition hover:bg-fuchsia-500"
            >
                Guardar musica
            </button>
        </div>
    );
}

function SettingsContent() {
    return (
        <div className="space-y-4">
            <button
                type="button"
                className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white transition hover:bg-fuchsia-500/20"
            >
                Editar perfil
            </button>

            <button
                type="button"
                className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white transition hover:bg-fuchsia-500/20"
            >
                Cambiar avatar
            </button>

            <button
                type="button"
                className="w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-white transition hover:bg-fuchsia-500/20"
            >
                Preferencias de reproduccion
            </button>

            <button
                type="button"
                className="w-full rounded-2xl bg-red-500/15 px-5 py-4 text-left text-red-300 transition hover:bg-red-500/25"
            >
                Cerrar sesion
            </button>
        </div>
    );
}

export default AppModal;
