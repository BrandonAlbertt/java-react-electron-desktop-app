import { useState } from "react";
import UserProfile from "./UserProfile";
import FavoritesCarousel from "./FavoritesCarousel";
import WindowControls from "./WindowControls";
import { favoriteLists } from "../../data/favoriteLists";

/*
  TopHeader.jsx

  Este componente representa toda la barra superior de la aplicación.

  Funcionalidades principales:
  - Mostrar la información del usuario al lado izquierdo
  - Mostrar el carrusel de listas favoritas en el centro
  - Mostrar los controles de ventana al lado derecho

  Componentes que utiliza:
  - UserProfile.jsx
  - FavoritesCarousel.jsx
  - WindowControls.jsx

  Datos que requiere:
  - favoriteLists.js para renderizar las listas favoritas

  Nota:
  - Administra la lista favorita actualmente seleccionada
  - Está preparado para integrarse con Electron
*/
/*
  TopHeader.jsx

  Este componente representa la barra superior de la aplicación.

  Nota importante:
  Se utiliza la clase personalizada "drag-region" (definida en index.css)
  para permitir arrastrar la ventana en Electron (frame: false).

  Las zonas interactivas como botones y carrusel usan "no-drag"
  para evitar conflictos con el arrastre.

  Estas clases no pertenecen a Tailwind CSS.
*/

export default function TopHeader() {
    const [lists, setLists] = useState(favoriteLists);
    const [activeList, setActiveList] = useState(favoriteLists[2]);

    const handleSelectList = (list) => {
        setActiveList(list);
    };

    const handleAddList = () => {
        const newList = {
            id: Date.now(),
            name: `Nueva Lista ${lists.length + 1}`,
            cover: "https://i.imgur.com/Nh6G6xG.jpeg",
        };

        setLists((prev) => [...prev, newList]);
    };

    const handleMinimize = () => {
        console.log("Minimizar ventana");
    };

    const handleMaximize = () => {
        console.log("Maximizar ventana");
    };

    const handleClose = () => {
        console.log("Cerrar ventana");
    };

    return (
        <header className="drag-region flex h-[150px] w-full items-start gap-6 px-6 pt-5">

            
            <div className="no-drag">
                <UserProfile
                userName="NickName"
                userImage="https://i.imgur.com/4AiXzf8.jpeg"
                />
            </div>

            <div className="no-drag flex-1">
                <FavoritesCarousel
                    lists={lists}
                    activeListId={activeList.id}
                    onSelectList={handleSelectList}
                    onAddList={handleAddList}
                />
            </div>

            <div className="no-drag">
                <WindowControls
                    onMinimize={handleMinimize}
                    onMaximize={handleMaximize}
                    onClose={handleClose}
                />
            </div>
        </header>
    );
}