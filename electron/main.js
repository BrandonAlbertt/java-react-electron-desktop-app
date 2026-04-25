const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

/*
    main.js (proceso principal de Electron)
    - Inicia la app de escritorio y crea la ventana principal.
    - Carga preload.js para crear un puente seguro entre la interfaz (React) y este proceso principal.
    - Recibe mensajes desde preload.js y ejecuta acciones del sistema, como minimizar, maximizar o cerrar.
    - Idea simple: preload.js "pide" y main.js "ejecuta".
*/

let mainWindow;

// Crea y configura la ventana principal
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,

        frame: false,              // quita barra nativa
        autoHideMenuBar: true,     // quita File Edit View
        backgroundColor: "#0a0a0a",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Carga la app React en modo desarrollo
    mainWindow.loadURL("http://localhost:5173");
}

// Arranque de la app y registro de eventos IPC
app.whenReady().then(() => {
    createWindow();

    // Minimizar ventana
    ipcMain.on("window-minimize", () => {
        mainWindow?.minimize();
    });

    // Alterna entre maximizar y restaurar
    ipcMain.on("window-maximize", () => {
        if (!mainWindow) return;

        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });

    // Cerrar ventana
    ipcMain.on("window-close", () => {
        mainWindow?.close();
    });
});

// Cierra la app al cerrar todas las ventanas (excepto en macOS)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});