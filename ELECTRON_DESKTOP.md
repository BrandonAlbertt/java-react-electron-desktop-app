# GuÃ­a completa de Electron para integrar React + Java

## 1. Objetivo de esta parte

En esta secciÃ³n se configura **Electron** para convertir el proyecto en una **aplicaciÃ³n de escritorio**.

Electron se encargarÃ¡ de:

- abrir una ventana de escritorio
- cargar el frontend hecho con React + Vite
- quitar la barra de ventana nativa de Windows
- permitir una barra personalizada diseÃ±ada en React
- permitir usar botones propios de **minimizar, maximizar y cerrar**
- definir un tamaÃ±o mÃ­nimo permitido para la ventana

En este proyecto, Electron actÃºa como la **capa de escritorio**.

Resumen simple:

- **Java** = backend
- **React** = interfaz visual
- **Electron** = contenedor de escritorio

---

## 2. QuÃ© se necesita antes de usar Electron

Antes de configurar Electron, ya debe existir:

- el backend Java funcionando
- el frontend React funcionando
- Node.js y pnpm instalados

TambiÃ©n conviene tener el frontend corriendo con Vite en:

```text
http://localhost:5173
```

Porque Electron cargarÃ¡ esa ruta durante el desarrollo.

---

## 3. Crear la carpeta de Electron

Desde la raÃ­z del proyecto, crea una carpeta para Electron:

```bash
mkdir electron
cd electron
```

---

## 4. Inicializar package.json

Dentro de la carpeta `electron`, ejecuta:

```bash
pnpm init
```

Esto crea el archivo `package.json`.

---

## 5. Instalar Electron

Ejecuta:

```bash
pnpm add -D electron
```

### QuÃ© hace esta librerÃ­a

- instala Electron en el proyecto
- permite abrir ventanas de escritorio usando Chromium + Node.js
- solo se usa para desarrollo y empaquetado, por eso se agrega como `devDependency`

---

## 6. package.json de Electron

Archivo:

### `package.json`

```json
{
  "name": "electron",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^41.2.1"
  }
}
```

### ExplicaciÃ³n breve

- `main`: indica cuÃ¡l es el archivo principal de Electron
- `start`: permite ejecutar Electron con `ppnpm start`
- `electron`: dependencia que crea la app de escritorio

---

## 7. Archivos que se usan en Electron

En esta configuraciÃ³n se usan tres archivos principales:

- `main.js`
- `preload.js`
- `package.json`

Resumen:

- `main.js` controla la ventana principal
- `preload.js` expone funciones seguras al frontend React
- `package.json` configura cÃ³mo se ejecuta Electron

---

## 8. main.js

Archivo:

### `main.js`

```js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,

        frame: false,
        autoHideMenuBar: true,
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
```

---

## 9. ExplicaciÃ³n de `main.js`

### `app`
Controla el ciclo de vida de la aplicaciÃ³n Electron.

### `BrowserWindow`
Crea la ventana principal de escritorio.

### `ipcMain`
Recibe mensajes enviados desde el frontend React.

### `path`
Se usa para encontrar correctamente la ruta del archivo `preload.js`.

### `let mainWindow`
Guarda la referencia de la ventana principal.

### `createWindow()`
FunciÃ³n que construye la ventana de Electron.

---

## 10. TamaÃ±o inicial y tamaÃ±o mÃ­nimo permitido

Dentro de `BrowserWindow` se configurÃ³:

```js
width: 1200,
height: 800,
minWidth: 1200,
minHeight: 800,
```

### QuÃ© significa

- `width`: ancho inicial de la ventana
- `height`: alto inicial de la ventana
- `minWidth`: ancho mÃ­nimo permitido
- `minHeight`: alto mÃ­nimo permitido

Con esto, el usuario puede agrandar la ventana, pero no reducirla a menos de `1200 x 800`.

---

## 11. CÃ³mo quitar la barra nativa de Windows

Se configurÃ³ esto:

```js
frame: false,
autoHideMenuBar: true,
```

### QuÃ© hace cada uno

#### `frame: false`
Quita la barra de ventana por defecto del sistema operativo.

Eso elimina:

- tÃ­tulo nativo de la ventana
- botones nativos de minimizar, maximizar y cerrar
- borde tÃ­pico del sistema

#### `autoHideMenuBar: true`
Oculta la barra de menÃº tradicional de Electron.

Eso elimina menÃºs como:

- File
- Edit
- View
- Window

Con estas dos opciones, la ventana queda limpia para usar una barra personalizada hecha en React.

---

## 12. Fondo de la ventana

Se configurÃ³:

```js
backgroundColor: "#0a0a0a",
```

Esto define el color de fondo inicial de la ventana mientras carga la interfaz.

Sirve para que el inicio combine mejor con el tema oscuro del frontend.

---

## 13. Seguridad bÃ¡sica en Electron

Dentro de `webPreferences` se configurÃ³:

```js
webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false
}
```

### ExplicaciÃ³n breve

#### `preload`
Indica quÃ© archivo se ejecutarÃ¡ antes de cargar el frontend.

#### `contextIsolation: true`
AÃ­sla el frontend del contexto interno de Electron.

Esto mejora la seguridad.

#### `nodeIntegration: false`
Evita que React use directamente Node.js en la ventana.

TambiÃ©n mejora la seguridad.

---

## 14. CÃ³mo Electron carga el frontend React

En `main.js` se usa:

```js
mainWindow.loadURL("http://localhost:5173");
```

### QuÃ© hace

Carga la aplicaciÃ³n React que estÃ¡ corriendo con Vite en desarrollo.

Durante desarrollo:

- React debe estar corriendo con `pnpm dev`
- Electron abre la URL local del frontend

---

## 15. preload.js

Archivo:

### `preload.js`

```js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
});
```

---

## 16. QuÃ© hace `preload.js`

Este archivo crea un puente seguro entre Electron y React.

### `contextBridge`
Permite exponer funciones especÃ­ficas al frontend.

### `ipcRenderer`
Permite enviar mensajes desde React hacia Electron.

### `exposeInMainWorld`
Hace disponible un objeto global llamado:

```js
window.electronAPI
```

Ese objeto se podrÃ¡ usar dentro del frontend React.

---

## 17. QuÃ© funciones se exponen al frontend

En `preload.js` se expusieron estas funciones:

```js
window.electronAPI.minimize()
window.electronAPI.maximize()
window.electronAPI.close()
```

### QuÃ© hace cada una

- `minimize()` envÃ­a el evento `window-minimize`
- `maximize()` envÃ­a el evento `window-maximize`
- `close()` envÃ­a el evento `window-close`

Estas funciones no hacen el trabajo directamente.
Solo envÃ­an un mensaje a `main.js`.

---

## 18. CÃ³mo `main.js` escucha esos eventos

En `main.js` se usan estos eventos:

```js
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
```

### QuÃ© hace esto

- escucha mensajes enviados desde React
- ejecuta acciones reales sobre la ventana de Electron

---

## 19. CÃ³mo funcionan los botones personalizados desde React

En React se usaron botones asÃ­:

```jsx
<button onClick={() => window.electronAPI?.minimize()}>â€”</button>
<button onClick={() => window.electronAPI?.maximize()}>â–¡</button>
<button onClick={() => window.electronAPI?.close()}>âœ•</button>
```

### Flujo real

1. el usuario hace clic en un botÃ³n del frontend
2. React llama a `window.electronAPI`
3. `preload.js` envÃ­a un evento IPC
4. `main.js` recibe ese evento
5. Electron ejecuta la acciÃ³n sobre la ventana

Resumen:

```text
React -> preload.js -> ipcRenderer -> ipcMain -> BrowserWindow
```

---

## 20. CÃ³mo se logrÃ³ una barra personalizada en React

Como la barra nativa de Windows fue eliminada con:

```js
frame: false
```

la parte superior de la app tuvo que diseÃ±arse manualmente desde React.

En React se usÃ³ una cabecera personalizada.

TambiÃ©n se aplicaron estas propiedades:

```jsx
style={{ WebkitAppRegion: "drag" }}
```

y dentro de los botones:

```jsx
style={{ WebkitAppRegion: "no-drag" }}
```

### QuÃ© significa

#### `drag`
Hace que una zona pueda arrastrar la ventana, como una barra normal.

#### `no-drag`
Evita que los botones se comporten como zona de arrastre.

Esto permite:

- mover la ventana desde la cabecera
- seguir haciendo clic en botones normalmente

---

## 21. CÃ³mo abrir la app en pantalla completa

Si se desea iniciar en pantalla completa, se puede agregar en `BrowserWindow`:

```js
fullscreen: true,
```

Ejemplo:

```js
mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0a",
    webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false
    }
});
```

### Importante

Para este proyecto no fue obligatorio usar pantalla completa.

Lo que sÃ­ se configurÃ³ fue:

- tamaÃ±o inicial amplio
- tamaÃ±o mÃ­nimo permitido
- adaptaciÃ³n del frontend al cambiar tamaÃ±o

Eso normalmente es mÃ¡s cÃ³modo que forzar fullscreen.

---

## 22. CÃ³mo maximizar al iniciar sin usar fullscreen

Si se quiere abrir la app maximizada al inicio, se puede hacer despuÃ©s de crear la ventana:

```js
mainWindow.maximize();
```

Ejemplo:

```js
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: false,
        autoHideMenuBar: true,
        backgroundColor: "#0a0a0a",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:5173");
    mainWindow.maximize();
}
```

### Diferencia

- `fullscreen: true` ocupa toda la pantalla y oculta elementos del sistema
- `maximize()` agranda la ventana al mÃ¡ximo, pero sigue siendo una ventana normal

---

## 23. Estructura mÃ­nima de la carpeta Electron

```text
electron/
â”œâ”€â”€ main.js
â”œâ”€â”€ preload.js
â””â”€â”€ package.json
```

---

## 24. CÃ³mo ejecutar Electron

Primero debe estar corriendo React:

```bash
cd frontend
pnpm dev
```

Luego, en otra terminal, ejecutar Electron:

```bash
cd electron
ppnpm start
```

### QuÃ© hace

- React levanta la interfaz en `localhost:5173`
- Electron abre una ventana de escritorio y carga esa URL

---

## 25. Orden correcto para probar todo

### Terminal 1: backend Java

```bash
cd backend-java
mvn clean compile exec:java
```

### Terminal 2: frontend React

```bash
cd frontend
pnpm dev
```

### Terminal 3: Electron

```bash
cd electron
ppnpm start
```

---

## 26. QuÃ© se logrÃ³ con esta configuraciÃ³n

Con esta parte del proyecto se logrÃ³:

- convertir React en una app de escritorio
- quitar la barra nativa de Windows
- ocultar el menÃº File/Edit/View
- usar una barra diseÃ±ada manualmente en React
- usar botones personalizados de minimizar, maximizar y cerrar
- definir tamaÃ±o mÃ­nimo permitido
- mantener una apariencia mÃ¡s moderna

---

## 27. Resumen breve de conceptos clave

### Electron
Convierte tecnologÃ­as web en una aplicaciÃ³n de escritorio.

### BrowserWindow
Crea la ventana principal de la aplicaciÃ³n.

### preload.js
Expone funciones seguras al frontend React.

### ipcRenderer
EnvÃ­a eventos desde React hacia Electron.

### ipcMain
Recibe eventos y ejecuta acciones en la ventana.

### frame: false
Quita la barra nativa de la ventana.

### autoHideMenuBar: true
Oculta la barra de menÃº tradicional.

### minWidth / minHeight
Definen el tamaÃ±o mÃ­nimo permitido.

### WebkitAppRegion
Permite crear una barra arrastrable personalizada.

---

## 28. ConclusiÃ³n

Electron fue la parte que permitiÃ³ que el proyecto dejara de ser solo una web y pasara a comportarse como una aplicaciÃ³n de escritorio.

Gracias a esta configuraciÃ³n:

- el frontend React se muestra como software de escritorio
- la ventana tiene un diseÃ±o mÃ¡s limpio
- el usuario puede controlar la ventana con botones propios
- el proyecto se ve mÃ¡s moderno y mÃ¡s profesional




