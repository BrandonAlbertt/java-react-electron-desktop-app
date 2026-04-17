# Guía completa de Electron para integrar React + Java

## 1. Objetivo de esta parte

En esta sección se configura **Electron** para convertir el proyecto en una **aplicación de escritorio**.

Electron se encargará de:

- abrir una ventana de escritorio
- cargar el frontend hecho con React + Vite
- quitar la barra de ventana nativa de Windows
- permitir una barra personalizada diseñada en React
- permitir usar botones propios de **minimizar, maximizar y cerrar**
- definir un tamaño mínimo permitido para la ventana

En este proyecto, Electron actúa como la **capa de escritorio**.

Resumen simple:

- **Java** = backend
- **React** = interfaz visual
- **Electron** = contenedor de escritorio

---

## 2. Qué se necesita antes de usar Electron

Antes de configurar Electron, ya debe existir:

- el backend Java funcionando
- el frontend React funcionando
- Node.js y npm instalados

También conviene tener el frontend corriendo con Vite en:

```text
http://localhost:5173
```

Porque Electron cargará esa ruta durante el desarrollo.

---

## 3. Crear la carpeta de Electron

Desde la raíz del proyecto, crea una carpeta para Electron:

```bash
mkdir electron
cd electron
```

---

## 4. Inicializar package.json

Dentro de la carpeta `electron`, ejecuta:

```bash
npm init -y
```

Esto crea el archivo `package.json`.

---

## 5. Instalar Electron

Ejecuta:

```bash
npm install electron --save-dev
```

### Qué hace esta librería

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

### Explicación breve

- `main`: indica cuál es el archivo principal de Electron
- `start`: permite ejecutar Electron con `npm start`
- `electron`: dependencia que crea la app de escritorio

---

## 7. Archivos que se usan en Electron

En esta configuración se usan tres archivos principales:

- `main.js`
- `preload.js`
- `package.json`

Resumen:

- `main.js` controla la ventana principal
- `preload.js` expone funciones seguras al frontend React
- `package.json` configura cómo se ejecuta Electron

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

## 9. Explicación de `main.js`

### `app`
Controla el ciclo de vida de la aplicación Electron.

### `BrowserWindow`
Crea la ventana principal de escritorio.

### `ipcMain`
Recibe mensajes enviados desde el frontend React.

### `path`
Se usa para encontrar correctamente la ruta del archivo `preload.js`.

### `let mainWindow`
Guarda la referencia de la ventana principal.

### `createWindow()`
Función que construye la ventana de Electron.

---

## 10. Tamaño inicial y tamaño mínimo permitido

Dentro de `BrowserWindow` se configuró:

```js
width: 1200,
height: 800,
minWidth: 1200,
minHeight: 800,
```

### Qué significa

- `width`: ancho inicial de la ventana
- `height`: alto inicial de la ventana
- `minWidth`: ancho mínimo permitido
- `minHeight`: alto mínimo permitido

Con esto, el usuario puede agrandar la ventana, pero no reducirla a menos de `1200 x 800`.

---

## 11. Cómo quitar la barra nativa de Windows

Se configuró esto:

```js
frame: false,
autoHideMenuBar: true,
```

### Qué hace cada uno

#### `frame: false`
Quita la barra de ventana por defecto del sistema operativo.

Eso elimina:

- título nativo de la ventana
- botones nativos de minimizar, maximizar y cerrar
- borde típico del sistema

#### `autoHideMenuBar: true`
Oculta la barra de menú tradicional de Electron.

Eso elimina menús como:

- File
- Edit
- View
- Window

Con estas dos opciones, la ventana queda limpia para usar una barra personalizada hecha en React.

---

## 12. Fondo de la ventana

Se configuró:

```js
backgroundColor: "#0a0a0a",
```

Esto define el color de fondo inicial de la ventana mientras carga la interfaz.

Sirve para que el inicio combine mejor con el tema oscuro del frontend.

---

## 13. Seguridad básica en Electron

Dentro de `webPreferences` se configuró:

```js
webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false
}
```

### Explicación breve

#### `preload`
Indica qué archivo se ejecutará antes de cargar el frontend.

#### `contextIsolation: true`
Aísla el frontend del contexto interno de Electron.

Esto mejora la seguridad.

#### `nodeIntegration: false`
Evita que React use directamente Node.js en la ventana.

También mejora la seguridad.

---

## 14. Cómo Electron carga el frontend React

En `main.js` se usa:

```js
mainWindow.loadURL("http://localhost:5173");
```

### Qué hace

Carga la aplicación React que está corriendo con Vite en desarrollo.

Durante desarrollo:

- React debe estar corriendo con `npm run dev`
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

## 16. Qué hace `preload.js`

Este archivo crea un puente seguro entre Electron y React.

### `contextBridge`
Permite exponer funciones específicas al frontend.

### `ipcRenderer`
Permite enviar mensajes desde React hacia Electron.

### `exposeInMainWorld`
Hace disponible un objeto global llamado:

```js
window.electronAPI
```

Ese objeto se podrá usar dentro del frontend React.

---

## 17. Qué funciones se exponen al frontend

En `preload.js` se expusieron estas funciones:

```js
window.electronAPI.minimize()
window.electronAPI.maximize()
window.electronAPI.close()
```

### Qué hace cada una

- `minimize()` envía el evento `window-minimize`
- `maximize()` envía el evento `window-maximize`
- `close()` envía el evento `window-close`

Estas funciones no hacen el trabajo directamente.
Solo envían un mensaje a `main.js`.

---

## 18. Cómo `main.js` escucha esos eventos

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

### Qué hace esto

- escucha mensajes enviados desde React
- ejecuta acciones reales sobre la ventana de Electron

---

## 19. Cómo funcionan los botones personalizados desde React

En React se usaron botones así:

```jsx
<button onClick={() => window.electronAPI?.minimize()}>—</button>
<button onClick={() => window.electronAPI?.maximize()}>□</button>
<button onClick={() => window.electronAPI?.close()}>✕</button>
```

### Flujo real

1. el usuario hace clic en un botón del frontend
2. React llama a `window.electronAPI`
3. `preload.js` envía un evento IPC
4. `main.js` recibe ese evento
5. Electron ejecuta la acción sobre la ventana

Resumen:

```text
React -> preload.js -> ipcRenderer -> ipcMain -> BrowserWindow
```

---

## 20. Cómo se logró una barra personalizada en React

Como la barra nativa de Windows fue eliminada con:

```js
frame: false
```

la parte superior de la app tuvo que diseñarse manualmente desde React.

En React se usó una cabecera personalizada.

También se aplicaron estas propiedades:

```jsx
style={{ WebkitAppRegion: "drag" }}
```

y dentro de los botones:

```jsx
style={{ WebkitAppRegion: "no-drag" }}
```

### Qué significa

#### `drag`
Hace que una zona pueda arrastrar la ventana, como una barra normal.

#### `no-drag`
Evita que los botones se comporten como zona de arrastre.

Esto permite:

- mover la ventana desde la cabecera
- seguir haciendo clic en botones normalmente

---

## 21. Cómo abrir la app en pantalla completa

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

Lo que sí se configuró fue:

- tamaño inicial amplio
- tamaño mínimo permitido
- adaptación del frontend al cambiar tamaño

Eso normalmente es más cómodo que forzar fullscreen.

---

## 22. Cómo maximizar al iniciar sin usar fullscreen

Si se quiere abrir la app maximizada al inicio, se puede hacer después de crear la ventana:

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
- `maximize()` agranda la ventana al máximo, pero sigue siendo una ventana normal

---

## 23. Estructura mínima de la carpeta Electron

```text
electron/
├── main.js
├── preload.js
└── package.json
```

---

## 24. Cómo ejecutar Electron

Primero debe estar corriendo React:

```bash
cd frontend
npm run dev
```

Luego, en otra terminal, ejecutar Electron:

```bash
cd electron
npm start
```

### Qué hace

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
npm run dev
```

### Terminal 3: Electron

```bash
cd electron
npm start
```

---

## 26. Qué se logró con esta configuración

Con esta parte del proyecto se logró:

- convertir React en una app de escritorio
- quitar la barra nativa de Windows
- ocultar el menú File/Edit/View
- usar una barra diseñada manualmente en React
- usar botones personalizados de minimizar, maximizar y cerrar
- definir tamaño mínimo permitido
- mantener una apariencia más moderna

---

## 27. Resumen breve de conceptos clave

### Electron
Convierte tecnologías web en una aplicación de escritorio.

### BrowserWindow
Crea la ventana principal de la aplicación.

### preload.js
Expone funciones seguras al frontend React.

### ipcRenderer
Envía eventos desde React hacia Electron.

### ipcMain
Recibe eventos y ejecuta acciones en la ventana.

### frame: false
Quita la barra nativa de la ventana.

### autoHideMenuBar: true
Oculta la barra de menú tradicional.

### minWidth / minHeight
Definen el tamaño mínimo permitido.

### WebkitAppRegion
Permite crear una barra arrastrable personalizada.

---

## 28. Conclusión

Electron fue la parte que permitió que el proyecto dejara de ser solo una web y pasara a comportarse como una aplicación de escritorio.

Gracias a esta configuración:

- el frontend React se muestra como software de escritorio
- la ventana tiene un diseño más limpio
- el usuario puede controlar la ventana con botones propios
- el proyecto se ve más moderno y más profesional

