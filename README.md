# MI-APP-DESKTOP

## 🎯 Objetivo del proyecto
Este proyecto tiene como objetivo construir una aplicación de escritorio moderna utilizando tecnologías actuales:

- **Backend:** Java + Maven (API REST con Javalin)
- **Frontend:** React + Vite + Tailwind CSS
- **Desktop:** Electron

La idea es combinar lo mejor de cada mundo: la robustez de Java, la flexibilidad de React y la experiencia de usuario de una aplicación de escritorio.

---

## 🚀 ¿Está listo para producción?

Actualmente es un proyecto funcional y bien estructurado, ideal para:

- Proyectos reales pequeños/medianos
- Base para sistemas más complejos

Para producción completa aún se podría mejorar:

- Manejo de errores más avanzado
- Seguridad (auth, tokens, etc.)
- Base de datos persistente
- Empaquetado instalable (.exe)

---

## 💡 Ventajas frente a Java tradicional (Swing / JavaFX / NetBeans GUI)

Comparado con interfaces gráficas clásicas de Java:

### ✔ Ventajas

- Interfaz moderna (tipo Spotify, Discord, etc.)
- Uso de HTML + CSS + Tailwind → diseño mucho más flexible
- Mejor experiencia de usuario
- Separación clara entre frontend y backend
- Escalable y mantenible

### ❌ Limitaciones de GUI tradicional

- Interfaces más rígidas
- Diseño menos atractivo
- Difícil de adaptar a estilos modernos
- Menor integración con tecnologías web actuales

---

## 🔗 ¿Cómo se comunican?

El sistema funciona así:

- **React (Frontend)** hace peticiones HTTP (fetch)
- **Java (Backend)** responde con JSON
- **Electron** solo muestra la aplicación como escritorio

Ejemplo:

```
React → http://127.0.0.1:8080/api/saludo → Java
```

---

## ⚙️ Cómo ejecutar el proyecto

Debes abrir **4 terminales** si quieres levantar todo el ecosistema por separado:

### 1️⃣ Backend Java

```
cd backend-java
mvn clean compile exec:java
```

---

### 2️⃣ API Node.js

```bash
cd api-node
pnpm install
pnpm dev
```

---

### 3️⃣ Frontend React

```
cd frontend
pnpm install
pnpm dev
```

---

### 4️⃣ Electron

```
cd electron
pnpm install --ignore-scripts=false
pnpm start
```

---

## 📦 Proyectos, comandos y librerías

| Proyecto | Cómo levantarlo | Librerías principales |
|---|---|---|
| `backend-java` | `mvn clean compile exec:java` | `javalin`, `slf4j-simple`, `jackson-databind` |
| `api-node` | `pnpm dev` | `express`, `cors`, `dotenv`, `mysql2`, `bcrypt`, `jsonwebtoken`, `multer`, `uuid`, `nodemon` |
| `frontend` | `pnpm dev` | `react`, `react-dom`, `react-router-dom`, `axios`, `framer-motion`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `@rolldown/plugin-babel` |
| `electron` | `pnpm start` | `electron` |

---

## 🔐 Seguridad de dependencias (pnpm)

Este repositorio ahora usa **pnpm 11** y configuración de seguridad en la raíz:

- `minimum-release-age=1440` (espera 24h antes de instalar versiones recién publicadas)
- `ignore-scripts=true` (bloquea scripts de instalación por defecto)

Comandos recomendados una sola vez en tu máquina:

```
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

Instalación desde la raíz del repo:

```
pnpm install
```

Nota: Electron suele necesitar scripts de instalación para descargar binarios, por eso en su carpeta se usa `pnpm install --ignore-scripts=false`.

---

## 🧠 ¿Es escalable?

Sí.

Este proyecto está bien separado en capas:

- Backend independiente (Java)
- Frontend desacoplado (React)
- Contenedor de escritorio (Electron)

Esto permite:

- Migrar backend a Spring Boot fácilmente
- Conectar con base de datos
- Convertir frontend a web sin cambiar backend
- Escalar a arquitectura más grande

---

## 🧩 Conclusión

Este proyecto demuestra una arquitectura moderna para aplicaciones de escritorio, combinando tecnologías web con backend en Java.

Es una excelente base para proyectos reales y una muy buena carta de presentación como desarrollador.

---

👨‍💻 Desarrollado por Brandon Alberto Hualpa Butron
