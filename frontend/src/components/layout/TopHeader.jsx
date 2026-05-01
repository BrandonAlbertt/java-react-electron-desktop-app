import { useState } from "react";
import UserProfile from "./UserProfile";
import FavoritesCarousel from "./FavoritesCarousel";
import WindowControls from "./WindowControls";
import UserMenu from "./UserMenu";
import { favoriteLists } from "../../data/favoriteLists";

export default function TopHeader({ onOpenAddMusicModal }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [lists, setLists] = useState(favoriteLists);
    const [activeList, setActiveList] = useState(favoriteLists[2]);

    const handleSelectList = (list) => {
        setActiveList(list);
    };

    const handleMinimize = () => console.log("Minimizar");
    const handleMaximize = () => console.log("Maximizar");
    const handleClose = () => console.log("Cerrar");

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <header className="drag-region relative h-[150px] w-full px-6 pt-5">

            {/* IZQUIERDA */}
            <div className="no-drag absolute left-6 top-5 z-30">
                <UserProfile
                    userName="NickName"
                    userImage="https://i.imgur.com/4AiXzf8.jpeg"
                    onToggleMenu={toggleMenu}
                />

                <UserMenu
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            </div>

            {/* CENTRO REAL */}
            {/* reducir ancho para evitar choque con controles derehos y añadir padding-right pequeño */}
            <div className="no-drag absolute left-1/2 top-7 z-20 w-[820px] pr-6 -translate-x-1/2">
                <FavoritesCarousel
                    lists={lists}
                    activeListId={activeList.id}
                    onSelectList={handleSelectList}
                    onAddList={onOpenAddMusicModal}
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