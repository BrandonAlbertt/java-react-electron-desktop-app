const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,

        frame: false,              // ❌ quita barra nativa
        autoHideMenuBar: true,     // ❌ quita File Edit View
        backgroundColor: "#0a0a0a",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on("window-minimize", () => {
        mainWindow.minimize();
    });

    ipcMain.on("window-maximize", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });

    ipcMain.on("window-close", () => {
        mainWindow.close();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});