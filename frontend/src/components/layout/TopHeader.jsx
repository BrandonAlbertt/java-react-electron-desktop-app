import { useState } from "react";
import UserProfile from "./UserProfile";
import FavoritesCarousel from "./FavoritesCarousel";
import WindowControls from "./WindowControls";
import UserMenu from "./UserMenu";
import { listasFavoritas } from "../../data/favoriteLists";

export default function TopHeader({
    onOpenAddMusicModal,
    usuarioPerfil,
    onLogout,
    listas = [],
    listaSeleccionadaId,
    onSeleccionarLista
})
{

    // =============================
    // ESTADO LOCAL
    // =============================
    const [menuOpen, setMenuOpen] = useState(false);

    // =============================
    // FUNCIONES Y EVENTOS AGRUPADOS
    // =============================
    // Selección de lista
    const handleSelectLista = (lista) => {
        console.log("TopHeader seleccionó:", lista.id);
        // 🔥 ENVÍA EL ID AL HOME
        onSeleccionarLista?.(lista.id);
    };

    // Ventana (controles)
    const handleMinimize = () => console.log("Minimizar");
    const handleMaximize = () => console.log("Maximizar");
    const handleClose = () => console.log("Cerrar");

    // Menú de usuario
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    //console.log("TopHeader - usuarioCompleto: ", usuarioPerfil);
    //console.log("TopHeader - listas: ", listas);

    return (
        <header className="drag-region relative h-[150px] w-full px-6 pt-5">

            {/* IZQUIERDA */}
            <div className="no-drag absolute left-6 top-5 z-30">
                <UserProfile
                    userName={usuarioPerfil?.nombre_usuario || "Usuario"}
                    userImage={usuarioPerfil?.avatar || "http://rasb-brandon.local:3000/media/musicbh/avatares/organicobohemio.png"}
                    onToggleMenu={toggleMenu}
                />

                <UserMenu
                    onLogout={onLogout}
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            </div>

            {/* CENTRO REAL */}
            {/* reducir ancho para evitar choque con controles derehos y añadir padding-right pequeño */}
            <div className="no-drag absolute left-1/2 top-7 z-20 w-[820px] pr-6 -translate-x-1/2">
                <FavoritesCarousel
                    listas={listas}
                    activeListaId={listaSeleccionadaId}
                    onSelectLista={handleSelectLista}
                    onAddLista={onOpenAddMusicModal}
                />
            </div>

            {/* DERECHA */}
            <div className="no-drag absolute right-6 top-3 z-30">
                <WindowControls
                    onMinimize={handleMinimize}
                    onMaximize={handleMaximize}
                    onClose={handleClose}
                />
            </div>
        </header>
    );
}