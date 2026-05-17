# Crear ejecutable portable de Windows

Esta guia explica como se preparo el proyecto Electron + React/Vite + pnpm para generar un `.exe` portable de Windows que abre la app sin necesitar Vite ni `localhost`.

## 1. Problema inicial

El ejecutable `.exe` se generaba, pero al abrirlo no cargaba la web.

La causa era que Electron cargaba React con:

```js
mainWindow.loadURL("http://localhost:5173");
```

Esa URL solo existe cuando estamos desarrollando y Vite esta corriendo con `pnpm dev`.

Cuando se crea un ejecutable, Vite ya no esta levantado. Por eso, en produccion Electron debe abrir el archivo compilado:

```text
frontend/dist/index.html
```

Para eso se usa `loadFile()`.

## 2. Que se modifico

### electron/main.js

Se agrego una condicion usando `app.isPackaged`.

- En desarrollo, Electron carga Vite con `loadURL("http://localhost:5173")`.
- En produccion, Electron carga el archivo compilado con `loadFile()`.

### electron/package.json

Se configuro `electron-builder` para incluir dentro del ejecutable:

- `main.js`
- `preload.js`
- `assets/**/*`
- `frontend/dist/**/*`

Tambien se agregaron scripts para compilar el frontend antes de generar el ejecutable.

### frontend/vite.config.js

Se agrego:

```js
base: './',
```

Esto ayuda a que los archivos CSS, JS e imagenes funcionen cuando `index.html` se abre desde `file://`, que es lo que hace Electron en produccion.

### Icono

El icono configurado para Windows es:

```text
electron/assets/ico_musicbhv3.ico
```

Ese archivo debe existir para que el ejecutable no use el icono por defecto de Electron.

## 3. Codigo importante

### Diferenciar desarrollo y produccion

```js
if (app.isPackaged) {
    // Modo produccion: carga el React compilado incluido dentro del .exe.
    mainWindow.loadFile(
        path.join(__dirname, "frontend", "dist", "index.html")
    );
} else {
    // Modo desarrollo: carga Vite local.
    mainWindow.loadURL("http://localhost:5173");
}
```

### Configuracion de electron-builder

```json
{
  "build": {
    "appId": "com.musicbh.desktop",
    "productName": "musicBH",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "assets/**/*",
      {
        "from": "../frontend/dist",
        "to": "frontend/dist",
        "filter": [
          "**/*"
        ]
      }
    ],
    "win": {
      "icon": "assets/ico_musicbhv3.ico",
      "target": [
        "portable"
      ]
    }
  }
}
```

### Scripts de build

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "pnpm --dir ../frontend build && electron-builder --win",
    "build:portable": "pnpm --dir ../frontend build && electron-builder --win portable"
  }
}
```

## 4. Comandos para desarrollo

Para seguir programando normalmente se usan dos terminales.

### Terminal 1: frontend

```powershell
cd frontend
pnpm dev
```

Esto levanta Vite en:

```text
http://localhost:5173
```

### Terminal 2: Electron

```powershell
cd electron
pnpm start
```

En este modo Electron carga la URL de Vite. Esto permite seguir mejorando la app con recarga rapida durante el desarrollo.

## 5. Comandos para crear el ejecutable Windows

### Opcion paso a paso

Primero se compila React/Vite:

```powershell
cd frontend
pnpm build
```

Luego se genera el ejecutable:

```powershell
cd ../electron
pnpm build:win
```

### Opcion combinada

Como `build:win` ya compila el frontend antes de ejecutar `electron-builder`, tambien se puede correr directamente:

```powershell
cd electron
pnpm build:win
```

Tambien existe:

```powershell
cd electron
pnpm build:portable
```

## 6. Donde aparece el ejecutable

El ejecutable se genera dentro de:

```text
electron/dist/
```

El archivo portable se abre directamente sin instalar.

Tambien puede aparecer una carpeta:

```text
electron/dist/win-unpacked/
```

Esa carpeta contiene la app desempaquetada. Sirve para revisar o probar, pero no es el portable final.

## 7. Diferencia entre desarrollo y produccion

### Desarrollo

Electron carga:

```text
http://localhost:5173
```

Esto requiere que Vite este corriendo con:

```powershell
pnpm dev
```

### Produccion

Electron carga:

```text
frontend/dist/index.html
```

Esto no requiere Vite ni `localhost`, porque los archivos ya estan compilados e incluidos en el ejecutable.

## 8. Problemas comunes

### Pantalla blanca

Puede pasar si:

- No existe `frontend/dist`.
- Electron intenta cargar `localhost` en produccion.
- `frontend/dist` no fue incluido en `electron-builder`.
- Vite no tiene `base: './'` y los assets se buscan con rutas incorrectas.

### Icono de Electron por defecto

Revisar que exista:

```text
electron/assets/ico_musicbhv3.ico
```

Y que `electron/package.json` tenga:

```json
"icon": "assets/ico_musicbhv3.ico"
```

### Assets que no cargan

Revisar `frontend/vite.config.js`:

```js
export default defineConfig({
  base: './',
  plugins: [
    // plugins
  ],
});
```

Esto es importante cuando la app se abre desde `file://`.

### Falto ejecutar pnpm build en frontend

Si no se compila el frontend, no existe:

```text
frontend/dist/index.html
```

Ejecutar:

```powershell
cd frontend
pnpm build
```

### Error con NSIS

Electron-builder usa NSIS para generar el portable. Si aparece un error relacionado con NSIS:

- Revisar que `electron-builder` este instalado.
- Volver a ejecutar `pnpm build:win`.
- Borrar solo la salida `electron/dist/` si quedo un build incompleto.
- Verificar que el antivirus no este bloqueando la creacion del `.exe`.

### Diferencia entre portable y win-unpacked

`portable` es el archivo `.exe` que se puede abrir sin instalar.

`win-unpacked` es una carpeta con la aplicacion desempaquetada. Sirve para pruebas, pero normalmente se comparte el `.exe` portable.

## 9. Checklist final

- [ ] `frontend/dist` existe.
- [ ] `main.js` usa `app.isPackaged`.
- [ ] `package.json` incluye `frontend/dist`.
- [ ] El icono existe en `electron/assets`.
- [ ] `pnpm build:win` termina bien.
- [ ] El `.exe` abre sin `localhost`.
