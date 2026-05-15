# FRONTEND_REACT.md

## 1. Objetivo de esta parte

En esta parte se configura el **frontend** de la aplicaciÃ³n usando:

- **React** para la interfaz
- **Vite** para crear y ejecutar el proyecto rÃ¡pido
- **Tailwind CSS** para estilos modernos con clases
- **HTML** a travÃ©s del renderizado de React

Este frontend se conecta con el backend Java mediante una peticiÃ³n HTTP a:

```text
http://127.0.0.1:8080/api/saludo
```

---

## 2. QuÃ© se necesita antes de empezar

Antes de crear el frontend, ya debes tener instalado:

- **Node.js**
- **pnpm**
- **VS Code**
- El **backend Java corriendo** o al menos ya creado

Para verificar Node y pnpm:

```bash
node -v
pnpm -v
```

---

## 3. Crear el frontend con React y Vite

Desde la carpeta raÃ­z del proyecto, ejecutar:

```bash
pnpm create vite@latest frontend
```

Luego elegir:

- **Framework:** React
- **Variant:** JavaScript

Entrar a la carpeta creada:

```bash
cd frontend
```

Instalar dependencias base:

```bash
pnpm install
```

---

## 4. LibrerÃ­as necesarias del frontend

Instalar Tailwind y los plugins usados:

```bash
pnpm add tailwindcss @tailwindcss/vite @vitejs/plugin-react @rolldown/plugin-babel
```

### QuÃ© hace cada librerÃ­a

- **react**: construye la interfaz en componentes.
- **react-dom**: renderiza React en el navegador.
- **vite**: servidor de desarrollo rÃ¡pido y empaquetador.
- **tailwindcss**: framework de utilidades CSS.
- **@tailwindcss/vite**: integra Tailwind directamente con Vite.
- **@vitejs/plugin-react**: permite que Vite entienda React.
- **@rolldown/plugin-babel**: ayuda con la transformaciÃ³n del cÃ³digo React cuando se usa esa configuraciÃ³n.

---

## 5. Estructura bÃ¡sica del frontend

Una estructura simple puede quedar asÃ­:

```text
frontend/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ App.jsx
â”‚   â”œâ”€â”€ App.css
â”‚   â”œâ”€â”€ main.jsx
â”‚   â””â”€â”€ index.css
â”œâ”€â”€ package.json
â””â”€â”€ vite.config.js
```

---

## 6. Configurar Vite para React y Tailwind

Archivo:

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
})
```

### QuÃ© hace este archivo

- `defineConfig(...)`: define la configuraciÃ³n de Vite.
- `react()`: activa soporte para React.
- `babel(...)`: aplica la configuraciÃ³n indicada para React.
- `tailwindcss()`: activa Tailwind dentro de Vite.

---

## 7. Activar Tailwind

Archivo:

## `src/index.css`

```css
@import "tailwindcss";
```

### QuÃ© hace

Le dice al proyecto que cargue Tailwind CSS.

---

## 8. Punto de entrada de React

Archivo:

## `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### QuÃ© hace este archivo

- `StrictMode`: ayuda a detectar malas prÃ¡cticas en desarrollo.
- `createRoot(...)`: monta React en el HTML.
- `import './index.css'`: carga Tailwind.
- `App`: componente principal de la aplicaciÃ³n.

### Importante

No debes importar `index.css` dos veces.

---

## 9. CSS mÃ­nimo global

Archivo:

## `src/App.css`

```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
}
```

### QuÃ© hace

- elimina mÃ¡rgenes por defecto
- hace que la app ocupe todo el alto y ancho

---

## 10. Componente principal del frontend

Archivo:

## `src/App.jsx`

```jsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [datos, setDatos] = useState({
    mensaje: "Cargando...",
    estado: "cargando",
    hora: "-"
  });

  const [error, setError] = useState("");
  const [temaOscuro, setTemaOscuro] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/saludo");

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        setDatos({
          mensaje: data.mensaje ?? "Sin mensaje",
          estado: data.estado ?? "ok",
          hora: data.hora ?? "-"
        });

        setError("");
      } catch (err) {
        console.error("Error al conectar con Java backend:", err);
        setError(`No se pudo conectar con el backend Java: ${err.message}`);
      }
    };

    obtenerDatos();

    const intervalo = setInterval(obtenerDatos, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const cambiarTema = () => {
    setTemaOscuro(!temaOscuro);
  };

  return (
    <div
      className={
        temaOscuro
          ? "h-screen w-screen bg-neutral-950 text-white flex flex-col"
          : "h-screen w-screen bg-gray-100 text-gray-900 flex flex-col"
      }
    >
      <header
        className={
          temaOscuro
            ? "h-12 flex items-center justify-between px-4 bg-neutral-900 border-b border-white/10"
            : "h-12 flex items-center justify-between px-4 bg-white border-b border-gray-300"
        }
        style={{ WebkitAppRegion: "drag" }}
      >
        <span className="font-semibold">Mi App Desktop</span>

        <div
          className="flex gap-2 items-center"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          <button
            onClick={cambiarTema}
            className={
              temaOscuro
                ? "px-3 h-8 bg-white/10 hover:bg-white/20 rounded text-sm"
                : "px-3 h-8 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            }
          >
            {temaOscuro ? "â˜€" : "ðŸŒ™"}
          </button>

          <button
            onClick={() => window.electronAPI?.minimize()}
            className={
              temaOscuro
                ? "w-8 h-8 bg-white/10 hover:bg-white/20 rounded"
                : "w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
            }
          >
            â€”
          </button>

          <button
            onClick={() => window.electronAPI?.maximize()}
            className={
              temaOscuro
                ? "w-8 h-8 bg-white/10 hover:bg-white/20 rounded"
                : "w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded"
            }
          >
            â–¡
          </button>

          <button
            onClick={() => window.electronAPI?.close()}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            âœ•
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className={
            temaOscuro
              ? "w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
              : "w-full max-w-4xl rounded-2xl border border-gray-300 bg-white p-8 shadow-xl"
          }
        >
          <h1 className="text-4xl font-bold mb-6">
            App escritorio moderna
          </h1>

          <div className="space-y-3 text-lg">
            <p><span className="font-semibold">Mensaje:</span> {datos.mensaje}</p>
            <p><span className="font-semibold">Estado:</span> {datos.estado}</p>
            <p><span className="font-semibold">Hora backend:</span> {datos.hora}</p>

            {error && (
              <p className="text-red-400 font-medium">{error}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
```

---

## 11. ExplicaciÃ³n breve del cÃ³digo de `App.jsx`

### `useState`

Se usa para guardar datos que cambian en pantalla.

Se usan tres estados:

- `datos`: guarda el mensaje recibido del backend.
- `error`: guarda un mensaje si falla la conexiÃ³n.
- `temaOscuro`: cambia entre modo oscuro y claro.

### `useEffect`

Se ejecuta al cargar el componente.

AquÃ­ se usa para:

- llamar al backend cuando la pantalla inicia
- volver a consultar cada 3 segundos

### `fetch(...)`

Hace la peticiÃ³n HTTP al backend Java:

```js
fetch("http://127.0.0.1:8080/api/saludo")
```

### `setInterval(...)`

Vuelve a consultar la API cada 3 segundos.

### `window.electronAPI?.minimize()`

Estos botones no los maneja React por sÃ­ solo.

Los usa cuando la app se ejecuta dentro de **Electron**.

Sirven para:

- minimizar ventana
- maximizar ventana
- cerrar ventana

---

## 12. CÃ³mo se conecta el frontend con el backend Java

El backend Java expone esta ruta:

```text
http://127.0.0.1:8080/api/saludo
```

El frontend hace esta llamada:

```js
const res = await fetch("http://127.0.0.1:8080/api/saludo");
```

Luego convierte la respuesta a JSON:

```js
const data = await res.json();
```

Y guarda esos datos en React:

```js
setDatos({
  mensaje: data.mensaje ?? "Sin mensaje",
  estado: data.estado ?? "ok",
  hora: data.hora ?? "-"
});
```

### Flujo simple

```text
React -> fetch() -> Backend Java -> JSON -> React actualiza pantalla
```

---

## 13. QuÃ© debe estar corriendo para que funcione

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

Luego abrir en el navegador:

```text
http://localhost:5173
```

---

## 14. QuÃ© pasa si no carga los datos

Revisar estos puntos:

### 1. Ver si el backend Java estÃ¡ encendido

Probar en navegador:

```text
http://127.0.0.1:8080/api/saludo
```

### 2. Ver si React usa la misma URL correcta

Debe ser:

```js
fetch("http://127.0.0.1:8080/api/saludo")
```

### 3. Ver consola del navegador

Presionar `F12` y revisar errores.

### 4. Verificar que Tailwind estÃ© bien configurado

Si Tailwind falla, puede que la app funcione, pero sin estilos.

---

## 15. Comandos Ãºtiles

### Crear proyecto

```bash
pnpm create vite@latest frontend
```

### Instalar dependencias

```bash
pnpm install
pnpm add tailwindcss @tailwindcss/vite @vitejs/plugin-react @rolldown/plugin-babel
```

### Ejecutar frontend

```bash
pnpm dev
```

### Crear build de producciÃ³n

```bash
pnpm build
```

---

## 16. Resumen breve

En esta parte del proyecto se hizo lo siguiente:

- se creÃ³ el frontend con React y Vite
- se instalÃ³ Tailwind CSS
- se configurÃ³ Vite para usar React y Tailwind
- se creÃ³ un componente principal `App.jsx`
- se hizo una conexiÃ³n al backend Java con `fetch`
- se mostraron en pantalla los datos recibidos
- se agregÃ³ cambio de tema oscuro/claro
- se preparÃ³ la interfaz para funcionar dentro de Electron

---

## 17. QuÃ© sigue despuÃ©s

DespuÃ©s de esta parte, lo siguiente normalmente es:

- configurar **Electron**
- abrir React dentro de una ventana de escritorio
- conectar los botones de minimizar, maximizar y cerrar
- empaquetar la app como programa instalable



