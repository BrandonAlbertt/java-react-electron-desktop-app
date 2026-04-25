const { contextBridge, ipcRenderer } = require("electron");

/*
    preload.js (puente seguro)
    - Se ejecuta antes de que cargue la interfaz y expone funciones controladas en window.electronAPI.
    - Su finalidad es permitir que React pida acciones de ventana sin acceso directo a Node/Electron.
    - Relacion con main.js: aqui se envian mensajes (ipcRenderer.send) y main.js los recibe (ipcMain.on).
    - Idea simple: preload.js conecta la UI con main.js de forma segura.
*/

contextBridge.exposeInMainWorld("electronAPI", {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
});

/*
    Ejemplo de uso desde frontend (React):

        // Boton de minimizar en un componente React
        <button onClick={() => window.electronAPI.minimize()}>
            Minimizar
        </button>

    Nota:
    - Estas funciones no se importan en React.
    - Se usan desde el objeto global window.electronAPI expuesto por preload.
*/