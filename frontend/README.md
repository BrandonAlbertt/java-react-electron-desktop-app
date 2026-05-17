<!--
	README para la carpeta `frontend` del proyecto
	Generado para ser didáctico, técnico y práctico.
-->

# musicBH — Frontend (React + Vite)

Última actualización: 2026-05-16

Este documento explica el frontend de la aplicación desktop/web (carpeta `frontend`). Está pensado para que cualquier desarrollador —incluso junior— pueda entender, ejecutar y modificar la parte cliente de la app.

Resumen rápido
- Framework: React (Vite)
- Estilo: Tailwind CSS
- Bundler: Vite
- Package manager: pnpm
- Autenticación: JWT (almacenado en `localStorage`)
- Comunicación con backend: Axios (cliente central `axiosClient`)
- Integración Desktop: Electron (proceso principal en `electron/`)

Tabla de contenidos
- 1) Introducción general
- 2) Estructura del proyecto (carpetas importantes)
- 3) Flujo completo de datos (ejemplos reales)
- 4) Explicación de React (componentes, props, estados, flujos)
- 5) Hooks personalizados y su rol
- 6) Capa API (axiosClient, interceptors, ejemplos)
- 7) Backend (resumen de rutas, controllers, models)
- 8) Autenticación y persistencia de sesión
- 9) Docker: cómo se usa aquí
- 10) pnpm y workspace
- 11) Guía para levantar el proyecto (paso a paso)
- 12) Variables de entorno importantes
- 13) Ejemplos reales (requests/responses/código)
- 14) Diagrama visual del flujo
- 15) Cómo modificar / añadir features
- 16) Problemas comunes y soluciones
- 17) Buenas prácticas del proyecto
- 18) Por dónde empezar para entender rápido

---

**1) Introducción general**

musicBH es una aplicación musical que combina un frontend React (con Vite) y una API Node.js/Express. La app puede ejecutarse como aplicación de escritorio gracias a Electron. El frontend contiene la UI y la lógica cliente (componentes + hooks) y se comunica con la API usando JWT para autenticación.

Tecnologías principales usadas (carpeta `frontend`):
- React 18 (Vite)
- Tailwind CSS
- pnpm
- Axios (cliente HTTP centralizado)
- Electron (para empaquetado desktop)

En la raíz del repo encontrarás además la API (`api-node/`) y un proyecto Java (`backend-java/`) que no son parte directa del `frontend` pero conviene conocer cómo se comunican.

---

**2) Estructura del frontend (qué importa y por qué)**

Explico las carpetas más relevantes dentro de `frontend/` y el papel que juegan:

- `src/` — código fuente de la app React.
	- `src/components/` — componentes UI (divididos por responsabilidad):
		- `auth/` — `WelcomeScreen`, `LoginForm`, `RegisterForm` (pantallas y formularios de autenticación).
		- `layout/` — `TopHeader`, `PlayerBar`, `AppModal`, controles de ventana (interacción con Electron desde UI).
		- `music/` — paneles de reproducción, listas, carrusel de géneros.
	- `src/pages/` — vistas de nivel superior: `Welcome.jsx`, `Home.jsx`.
	- `src/hooks/` — hooks personalizados que encapsulan lógica de negocio y llamadas a API (ej: `useUsuario.js`, `useBiblioteca.js`, `useExplorar.js`, `useGrupos.js`, `useMusica.js`).
	- `src/api/` — funciones que hablan con el backend (ej: `usuarioApi.js`, `bibliotecaUsuarioApi.js`, `axiosClient.js`).
	- `src/utils/` — funciones utilitarias (ej: `slug.js`).
	- `src/main.jsx` — punto de entrada React.
	- `src/App.jsx` — componente raíz que controla si se muestra `Welcome` o `Home` según sesión.

Otros ficheros importantes en el workspace:
- `electron/` — `main.js`, `preload.js` — creación de la ventana Electron y puente seguro con la UI.
- `api-node/` — backend Express (rutas, controllers, middlewares), explicado más abajo.

NOTA: No describo archivos menores; me concentro en los que afectan flujo y arquitectura.

---

**3) Flujo completo de datos (ejemplo real — iniciar sesión + cargar biblioteca)**

Voy a explicar cómo viajan los datos cuando un usuario inicia sesión y abre `Home`.

Flujo resumido:

INPUT (usuario escribe email+password)
↓ (LoginForm.jsx usa un callback `iniciarSesion` de `useUsuario`)
React `useState` guarda valores del formulario
↓
Hook `useUsuario` -> llama a `usuarioApi.loginUsuario()`
↓
`axiosClient` manda POST a `/api/usuarios/login` con body { email, contrasena }
↓
Backend Express -> `usuario.routes.js` -> `loginUsuario` controller
↓
Controller verifica credenciales, genera JWT (token) y devuelve: `{ mensaje, token, usuario }`
↓
Frontend: `useUsuario.iniciarSesion` recibe `response`, guarda `token` en `localStorage` y `usuario` en estado/localStorage
↓
`App.jsx` cambia `isLogged` a true (por `onLogin`) y renderiza `Home` pasándole `usuario`
↓
`Home.jsx` llama `useBiblioteca(usuario.id)` -> `bibliotecaUsuarioApi.obtenerBibliotecaUsuario(usuarioId)`
↓
Axios (`axiosClient`) añade header `Authorization: Bearer <token>` automáticamente gracias al interceptor
↓
Backend verifica token con `auth.middleware` y responde con la biblioteca completa (usuario + listas + canciones)
↓
`Home.jsx` recibe datos y los pasa a componentes: `TopHeader`, `PlaylistPanel`, `PlayerBar`, etc.

Ejemplo real (Login request / response — coincide con `api-node/src/controllers/usuario.controller.js`):

Request (frontend -> backend):
```json
POST /api/usuarios/login
{
	"email": "juan@mail.com",
	"contrasena": "secreto"
}
```

Response (backend -> frontend):
```json
{
	"mensaje": "Login correcto",
	"token": "<JWT_TOKEN>",
	"usuario": {
		"id": 1,
		"avatar_id": 3,
		"nombre_usuario": "juan",
		"email": "juan@mail.com"
	}
}
```

Clave: `axiosClient` añade el token a todas las peticiones posteriores (ver `src/api/axiosClient.js`).

---

**4) Explicación de React en este proyecto (con ejemplos reales)**

- Componentes: unidades UI reutilizables. Ejemplos:
	- `LoginForm.jsx` (componente controlado): usa `useState` para inputs `email` y `password` y llama a `iniciarSesion` del hook.
	- `PlayerBar.jsx`: controla audio HTML5 (`<audio ref={audioRef} />`) y recibe props para reproducir/pausar.

- Props: datos / callbacks que el padre pasa al hijo.
	- En `App.jsx` el método `handleLogin` se pasa a `Welcome` como `onLogin`. Luego `LoginForm` invoca `onLogin(response)` tras login exitoso.

- Estado local (`useState`): se usa en formularios y en lógica UI (ej: `isPlaying`, `volume`, `shuffleActivo`).

- Efectos (`useEffect`): para iniciar acciones cuando cambian dependencias. Ejemplos:
	- `App.jsx` usa `useEffect(() => { ... }, [])` para restaurar sesión desde `localStorage` al arrancar.
	- `useBiblioteca` usa `useEffect` para llamar `recargarBiblioteca()` cuando cambia `usuarioId`.

- Callbacks (hijo -> padre):
	- El hijo puede notificar al padre usando funciones pasadas por `props` (ej: `onLogin`, `onLogout`, `onAbrirModalFavoritos`).

- Controlled inputs: los inputs en `LoginForm` y `RegisterForm` guardan su valor en `useState` y renderizan desde ese estado (pattern controlado).

- Modales: `AppModal` / `ModalFavoritos` se controlan por `isOpen` y `onClose` desde `Home.jsx`.

Ejemplo concreto: `LoginForm` → al hacer submit llama `iniciarSesion` (hook), que retorna `{ token, usuario }`. `LoginForm` pasa eso a `App` (vía `onLogin`) y `App` guarda token y cambia a `Home`.

---

**5) Hooks personalizados (qué hacen y quién los usa)**

- `useUsuario` (`src/hooks/useUsuario.js`)
	- Propósito: encapsular lógica CRUD de usuarios y autenticación.
	- Funciones clave: `cargarUsuarios`, `cargarUsuarioPorId`, `registrarUsuario`, `actualizarUsuario`, `iniciarSesion`, `cerrarSesion`, `cargarSesionGuardada`.
	- Lo usa: `LoginForm`, `RegisterForm`, otros componentes admin.

- `useBiblioteca` (`src/hooks/useBiblioteca.js`)
	- Propósito: cargar la biblioteca del usuario (usuario + listas + canciones) desde `/api/usuarios/:id/biblioteca`.
	- Retorna: `{ usuario, listas, loading, error, recargarBiblioteca, setListas }`.
	- Lo usa: `Home.jsx`.

- `useExplorar`, `useGrupos`, `useMusica`, `useListas` — cada uno encapsula llamadas a su API y estados relacionados (canciones, grupos, playlists).

Cómo se usan en el código:
- `Home.jsx` compone varios hooks: datos de `useBiblioteca` + `useExplorar` + `useListas` → pasa datos a componentes visuales. Eso mantiene `Home` como orquestador y los hooks como fuentes de verdad.

---

**6) Capa API (cliente HTTP: `axiosClient`)**

Fichero central: `src/api/axiosClient.js` — crea una instancia de axios con `baseURL` desde `import.meta.env.VITE_API_URL` y un interceptor de `request` que añade `Authorization: Bearer <token>` si `localStorage` contiene `token`.

Por qué centralizar: así todas las funciones en `src/api/*.js` reusan la misma configuración y el manejo del token queda en un solo lugar.

Ejemplo: `src/api/usuarioApi.js` exporta `loginUsuario(data)` que hace `axiosClient.post('/api/usuarios/login', data)`.

Interceptors
- Antes de cada petición, `axiosClient.interceptors.request.use` lee `localStorage.getItem('token')` y añade el header si existe.

Ejemplo de uso en `useUsuario.iniciarSesion` (simplificado):
```js
const response = await apiLoginUsuario({ email, contrasena });
// response: { mensaje, token, usuario }
localStorage.setItem('token', response.token);
localStorage.setItem('usuario', JSON.stringify(response.usuario));
```

Ejemplos de funciones API (archivos ya presentes):
- `usuarioApi.loginUsuario(data)` → POST `/api/usuarios/login`
- `usuarioApi.crearUsuario(data)` → POST `/api/usuarios`
- `bibliotecaUsuarioApi.obtenerBibliotecaUsuario(usuarioId)` → GET `/api/usuarios/:id/biblioteca`

---

**7) Backend: resumen y cómo encaja con frontend**

Carpeta principal del backend: `api-node/`.

- `routes/` — define rutas públicas y privadas. Ej: `usuario.routes.js` (login/registro públicos; resto protegido por `authMiddleware`).
- `controllers/` — la lógica que atiende cada ruta (ej: `usuario.controller.js` hace login, generar token y devolver usuario).
- `models/` — queries a la base de datos (MySQL/MariaDB). Los controllers llaman a los modelos.
- `middlewares/auth.middleware.js` — valida header `Authorization: Bearer <token>` usando `jwt.verify`. Si falla, responde 401.
- `services/token.service.js` — genera tokens JWT (ej: `generateToken(usuario)` usa `process.env.JWT_SECRET` y `process.env.JWT_EXPIRES_IN`).

Quién llama a quién:
- Frontend → `axiosClient` → Backend route (ej: `POST /api/usuarios/login`)
- Route → Controller → Model → DB
- Si la ruta requiere auth: `auth.middleware` ejecuta antes del Controller y garantiza que `req.usuario` esté disponible.

---

**8) Autenticación (cómo funciona en la práctica)**

Flujo de login
1. Usuario envía email+contrasena a `POST /api/usuarios/login` (vía `usuarioApi.loginUsuario`).
2. Backend valida y retorna `{ mensaje, token, usuario }`.
3. Frontend guarda `token` en `localStorage` y `usuario` (stringificado) también.
4. `axiosClient` añade automáticamente el header `Authorization` en siguientes peticiones.

Rutas públicas vs privadas
- Públicas: registro (`POST /api/usuarios`) y login (`POST /api/usuarios/login`).
- Privadas: cualquier ruta que use `authMiddleware` (ej: obtener biblioteca, editar usuario).

Expiración y restauración de sesión
- El backend firma tokens con `JWT_SECRET` y un `expiresIn` (ej: 2h). El frontend puede verificar `exp` dentro del JWT para limpiar sesión expirado o intentar rehidratar el usuario al iniciar la app (ver `App.jsx` en `src/`).

Seguridad práctico
- Almacenar token en `localStorage` es simple y funciona con Electron. Para mayor seguridad en apps web, considere `httpOnly cookies` según threat model.

---

**9) Docker (qué hay y cómo se usa aquí)**

Archivos relevantes (en `api-node/` y root): `api-node/Dockerfile`, `api-node/docker-compose.yml` (si existen). Estos proporcionan una forma reproducible de levantar la API con MySQL y dependencias.

Qué contiene típicamente:
- `Dockerfile` instala Node, copia código y ejecuta `pnpm install --frozen-lockfile` y `pnpm start`.
- `docker-compose.yml` orquesta servicios: `api-node` + `mysql`/`mariadb` + (posible) `phpmyadmin`.

Puntos importantes al usar pnpm en Docker:
- Use `pnpm install --frozen-lockfile` para garantizar coherencia con `pnpm-lock.yaml`.
- Si hay dependencias nativas (ej: `bcrypt`) asegúrese de instalar herramientas de compilación en la imagen (build-essential, python) o use `bcrypt` precompilado.

Volúmenes y puertos
- Mapear volúmenes para persistir datos MySQL.
- Exponer puertos (ej: 3000 para API, 3306 para MySQL).

---

**10) pnpm y workspace**

- `pnpm` es más rápido y usa un almacenamiento global para paquetes. El repo incluye `pnpm-lock.yaml`.
- Ventajas sobre npm: deduplicación eficiente y menor espacio.
- Si ves fallos en `bcrypt` dentro de contenedores, instala herramientas de compilación o usa una imagen que ya tenga binarios.

---

**11) Guía rápida para levantar el proyecto (local)**

Prerequisitos: Node (>=16), pnpm, Docker (si usar contenedores), MySQL si no usas Docker.

1) Clona el repo:
```bash
git clone <repo>
cd java-react-electron-desktop-app
```

2) Backend (API Node) — en otra terminal (opcional con Docker Compose):
- Usando Docker Compose (recomendado si está configurado en `api-node/docker-compose.yml`):
```bash
cd api-node
docker compose up --build
```
- O localmente con pnpm:
```bash
cd api-node
pnpm install
cp .env.example .env   # editar variables
pnpm dev
```

3) Frontend (desarrollo):
```bash
cd frontend
pnpm install
cp .env.local .env    # o crear .env con VITE_API_URL
# Ejemplo: VITE_API_URL=http://localhost:3000
pnpm dev
```

4) Electron (opcional — para abrir la app como escritorio):
```bash
cd electron
pnpm install
pnpm dev   # o el script que exista en package.json para lanzar electron + vite
```

5) Abrir `http://localhost:5173` (Vite) o la ventana de Electron.

---

**12) Variables importantes (.env)**

- `VITE_API_URL` — URL base que usa el frontend (ej: `http://localhost:3000`).
- `JWT_SECRET` — secreto para firmar JWT (backend).
- `JWT_EXPIRES_IN` — periodo del token (ej: `2h`).
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` — conexión a MySQL/MariaDB.
- Variables Docker-compose: puertos, volúmenes, credenciales.

Siempre mantén variables sensibles fuera del control de versiones (.env local, no subirlas).

---

**13) Ejemplos reales adicionales**

- `useUsuario.registrarUsuario(data)` -> llama `usuarioApi.crearUsuario(data)` y si el servidor devuelve `token` guarda `token` y `usuario` en `localStorage`.

- `useBiblioteca.recargarBiblioteca()` -> llama `obtenerBibliotecaUsuario(usuarioId)` que hace GET `/api/usuarios/:id/biblioteca` y devuelve `{ usuario, listas }`.

- `axiosClient` interceptor (snippet real):
```js
axiosClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
```

---

**14) Diagrama visual (ASCII) — flujo típico**

Frontend (React)
	└─> Hook (`useUsuario`) —> `axiosClient`
				└─> POST /api/usuarios/login
						└─> Backend Express `usuario.routes`
								 └─> Controller `loginUsuario` -> Model -> DB

Cuando ya hay token:
Frontend -> `axiosClient` (añade Authorization) -> Backend `auth.middleware` -> Controller -> Model -> DB

ASCII:

```
User input (Login form)
	↓
LoginForm (component)
	↓
useUsuario.iniciarSesion() (hook)
	↓
usuarioApi.loginUsuario() (axios)
	↓
Express route -> controller -> model
	↓
DB (MySQL)
	↓
Response -> frontend guarda token -> App shows Home
```

---

**15) Cómo modificar el proyecto — guia práctica**

- Añadir una nueva ruta backend
	1. `api-node/src/routes/new.route.js` define endpoints.
	2. Crear `api-node/src/controllers/new.controller.js` con la lógica.
	3. Crear `api-node/src/models/new.model.js` para queries SQL.
	4. Registrar la ruta en `api-node/src/app.js` o el router principal.

- Añadir un nuevo hook frontend
	1. Crear `src/hooks/useNewFeature.js` y encapsular la lógica (estado + llamadas a API)
	2. Crear `src/api/newApi.js` con las funciones axios (usar `axiosClient`)
	3. Consumir el hook desde la página o componente que lo necesite.

- Añadir una nueva tabla en DB
	1. Crear migración SQL y ejecutarla en la DB (si usas Docker, dentro del contenedor de MySQL).
	2. Crear modelo en `api-node/src/models/` y funciones CRUD.
	3. Crear controller y route.

- Añadir un modal
	1. Crear componente modal (ej: `src/components/modals/NewModal.jsx`) que reciba `isOpen` y `onClose`.
	2. Controlarlo desde la página padre (`useState`) y pasar callbacks.

---

**16) Problemas comunes y soluciones**

- Token inválido / expirado
	- Síntoma: respuestas 401 con mensaje "Token inválido o expirado".
	- Solución: limpiar `localStorage` y forzar login. En `App.jsx` ya hay lógica para comprobar `exp` del JWT.

- Docker no levanta / fallan builds de bcrypt
	- Instalar dependencias de compilación en la imagen (`build-essential`, `python`), o usar `bcryptjs` si quieres evitar builds nativos.

- .env faltante
	- Copiar `.env.example` y configurar las variables (DB, JWT, VITE_API_URL).

- CORS
	- Si frontend y backend corren en distintos hosts/puertos, habilitar CORS en backend (`cors()` middleware) o configurar proxys mientras desarrollas.

- Puertos ocupados
	- Cambiar `VITE_API_URL` o el puerto en `docker-compose.yml`.

- pnpm issues
	- Borrar `node_modules` y `pnpm store prune` o reinstalar con `pnpm install --frozen-lockfile`.

---

**17) Buenas prácticas (por qué está organizado así)**

- Separación por capas (controllers/models) hace simple testear y mantener la lógica de negocio.
- Hooks personalizados encapsulan efectos y lógica asíncrona, dejando componentes para renderizado.
- `axiosClient` centraliza headers, baseURL e interceptors evitando duplicidad.
- Guardar `token` y `usuario` en `localStorage` facilita rehidratación en Electron-desktop; si desarrollas solo web, evalúa `httpOnly cookies` para mayor seguridad.

---

**18) Por dónde empezar para entender rápido (ruta recomendada)**

1. `frontend/src/App.jsx` — ver flujo de sesión y render condicional Welcome/Home.
2. `frontend/src/api/axiosClient.js` — entender cómo se comunican todas las APIs.
3. `frontend/src/hooks/useUsuario.js` — ver cómo se hace login/registro y persistencia.
4. `frontend/src/pages/Welcome.jsx` y `src/components/auth/LoginForm.jsx` — UI de login.
5. `frontend/src/pages/Home.jsx` + `src/hooks/useBiblioteca.js` — cómo se carga y propaga la biblioteca del usuario.
6. `api-node/src/routes/usuario.routes.js` y `api-node/src/controllers/usuario.controller.js` — ver la contraparte del backend.

---

Si quieres, puedo:
- Generar un diagrama más detallado por componente (mermaid o ASCII).
- Añadir ejemplos de tests unitarios para hooks.
- Documentar específicamente `docker-compose.yml` y `Dockerfile` si quieres que los explique paso a paso.

Fin del README para `frontend`.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
