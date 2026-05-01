/*
  UserMenu.jsx
  Menu desplegable con opciones del usuario
  Se abre/cierra cuando se hace click en el avatar
*/

export default function UserMenu({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-[#0d0d12] border border-purple-500/30 shadow-xl backdrop-blur-md p-3 z-50">
            <button 
                className="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-transparent hover:bg-purple-500/20 transition"
                onClick={() => console.log("Config")}
            >
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Configuracion
            </button>

            <button 
                className="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-transparent hover:bg-red-500/20 transition mt-2"
                onClick={onClose}
            >
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Cerrar sesion
            </button>
        </div>
    );
}