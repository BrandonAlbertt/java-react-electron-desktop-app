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

Debes abrir **3 terminales**:

### 1️⃣ Backend Java

```
cd backend-java
mvn clean compile exec:java
```

---

### 2️⃣ Frontend React

```
cd frontend
npm install
npm run dev
```

---

### 3️⃣ Electron

```
cd electron
npm install
npm start
```

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
