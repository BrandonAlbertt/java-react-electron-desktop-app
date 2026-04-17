# Guía completa del backend Java con Maven para proyecto Desktop (React + Vite + Tailwind + Electron)

## 1. Objetivo de esta parte

En esta guía se configura **solo la parte backend en Java** de un proyecto de escritorio moderno con esta arquitectura:

- **Backend:** Java + Maven + Javalin
- **Frontend:** React + Vite + Tailwind CSS
- **Desktop shell:** Electron

El backend se encargará de:

- levantar un servidor local en un puerto, por ejemplo `8080`
- exponer rutas como `/api/saludo`
- devolver texto o JSON al frontend
- servir como base para luego agregar base de datos, lógica de negocio, autenticación y más endpoints

---

## 2. Qué se necesita antes de empezar

Antes de crear el backend, debes tener instalado lo siguiente:

### Software necesario

- **JDK** instalado
- **Maven** instalado o disponible desde tu IDE
- **VS Code** con soporte para Java
- terminal funcionando

### En este proyecto se está usando

- **JDK 25**
- **Maven**
- **Javalin 6.3.0**
- **Jackson Databind 2.17.2**
- **SLF4J Simple 2.0.13**

---

## 3. Qué es Maven y por qué se usa aquí

**Maven** es el gestor de dependencias y construcción del proyecto Java.

Sirve para:

- descargar librerías automáticamente desde internet
- evitar meter archivos `.jar` manualmente
- compilar el proyecto
- ejecutar el proyecto
- organizar dependencias y plugins desde `pom.xml`

En este proyecto, Maven se usa para descargar y manejar:

- Javalin
- SLF4J
- Jackson
- plugin para ejecutar la clase `Main`

---

## 4. Estructura mínima del backend

La estructura base recomendada es esta:

```text
backend-java/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── brandon/
        │           └── Main.java
        └── resources/
```

### Qué significa cada parte

#### `backend-java/`
Carpeta raíz del backend.

#### `pom.xml`
Archivo principal de Maven.

Aquí se define:

- nombre del proyecto
- versión
- versión de Java
- dependencias
- plugins

#### `src/main/java/`
Aquí va el código fuente Java.

#### `com/brandon/`
Es el paquete base del proyecto.

#### `Main.java`
Es el punto de inicio del backend.

#### `src/main/resources/`
Aquí pueden ir después:

- archivos de configuración
- templates
- propiedades
- recursos adicionales

---

## 5. Crear el proyecto backend manualmente

Si quieres hacerlo desde cero, crea esta estructura:

### En terminal

```bash
mkdir backend-java
cd backend-java
mkdir -p src/main/java/com/brandon
mkdir -p src/main/resources
```

Si estás en Windows y `mkdir -p` no funciona, crea las carpetas manualmente desde VS Code.

---

## 6. Archivo `pom.xml`

Este es el archivo que estás usando actualmente.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.brandon</groupId>
    <artifactId>backend-java</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>io.javalin</groupId>
            <artifactId>javalin</artifactId>
            <version>6.3.0</version>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.13</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.17.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.5.0</version>
                <configuration>
                    <mainClass>com.brandon.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

---

## 7. Explicación breve y puntual del `pom.xml`

### `groupId`

```xml
<groupId>com.brandon</groupId>
```

Identifica el grupo o nombre base del proyecto.

Normalmente se parece al paquete base.

---

### `artifactId`

```xml
<artifactId>backend-java</artifactId>
```

Es el nombre del proyecto o módulo.

---

### `version`

```xml
<version>1.0-SNAPSHOT</version>
```

Versión actual del proyecto.

`SNAPSHOT` indica que es una versión en desarrollo.

---

### `properties`

```xml
<properties>
    <maven.compiler.source>25</maven.compiler.source>
    <maven.compiler.target>25</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

Define:

- versión de Java usada para compilar
- versión objetivo del bytecode
- codificación UTF-8 para evitar problemas de caracteres

---

## 8. Librerías necesarias y qué hace cada una

### 8.1 Javalin

```xml
<dependency>
    <groupId>io.javalin</groupId>
    <artifactId>javalin</artifactId>
    <version>6.3.0</version>
</dependency>
```

**Qué es:**
Framework web liviano para Java.

**Para qué sirve en este proyecto:**

- levantar el servidor backend
- crear rutas como `GET /api/saludo`
- responder texto o JSON
- manejar peticiones HTTP fácilmente

**Por qué se usa:**
Porque es más simple y ligero para este proyecto que usar un framework más grande desde el inicio.

---

### 8.2 SLF4J Simple

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>2.0.13</version>
</dependency>
```

**Qué es:**
Implementación simple de logging para Java.

**Para qué sirve:**

- mostrar logs en consola
- ver mensajes del servidor
- ayudar al diagnóstico de errores

**Por qué se usa:**
Porque algunas librerías, como Javalin, usan SLF4J para registrar eventos y mensajes.

---

### 8.3 Jackson Databind

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.2</version>
</dependency>
```

**Qué es:**
Librería para convertir objetos Java a JSON y JSON a objetos Java.

**Para qué sirve en este proyecto:**

- permitir que `ctx.json(...)` funcione correctamente
- devolver respuestas JSON al frontend React

**Por qué es necesaria:**
Sin esta librería, Javalin no puede serializar correctamente estructuras Java a JSON en esta configuración.

---

## 9. Plugin necesario y qué hace

### Exec Maven Plugin

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>3.5.0</version>
    <configuration>
        <mainClass>com.brandon.Main</mainClass>
    </configuration>
</plugin>
```

**Qué hace:**
Permite ejecutar el proyecto directamente con Maven.

**Para qué sirve:**

- correr la clase principal sin crear un `.jar` manualmente
- ejecutar el backend con un solo comando

**Comando que habilita:**

```bash
mvn compile exec:java
```

---

## 10. Archivo `Main.java`

Este es el archivo principal que tienes actualmente.

```java
package com.brandon;

import io.javalin.Javalin;

import java.time.LocalDateTime;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(rule -> {
                    rule.anyHost();
                });
            });
        }).start(8080);

        app.get("/", ctx -> {
            ctx.result("Backend Java funcionando");
        });

        app.get("/favicon.ico", ctx -> {
            ctx.status(204);
        });

        app.get("/api/saludo", ctx -> {
            ctx.json(Map.of(
                    "mensaje", "Hola desde el backend Java",
                    "estado", "ok",
                    "hora", LocalDateTime.now().toString()));
        });
    }
}
```

---

## 11. Explicación breve de `Main.java`

### `package com.brandon;`

Define el paquete al que pertenece la clase.

Debe coincidir con la ruta de carpetas:

```text
src/main/java/com/brandon/Main.java
```

---

### `import io.javalin.Javalin;`

Importa la clase principal de Javalin para crear el servidor.

---

### `import java.time.LocalDateTime;`

Se usa para generar la hora actual y enviarla al frontend.

---

### `import java.util.Map;`

Se usa para construir una respuesta JSON simple con clave y valor.

---

### `public static void main(String[] args)`

Es el punto de entrada del backend.

Desde aquí arranca el servidor.

---

## 12. Qué hace esta línea

```java
Javalin app = Javalin.create(...).start(8080);
```

Crea la aplicación web y la levanta en el puerto `8080`.

Eso significa que tu backend estará disponible en:

```text
http://localhost:8080
```

---

## 13. Qué hace la configuración de CORS

```java
config.bundledPlugins.enableCors(cors -> {
    cors.addRule(rule -> {
        rule.anyHost();
    });
});
```

### Para qué sirve
Permite que otros orígenes, por ejemplo el frontend React en otro puerto, puedan consumir el backend.

### Por qué se necesita
Durante desarrollo, normalmente tendrás:

- React en `http://localhost:5173`
- Java en `http://localhost:8080`

Como son puertos distintos, el navegador los trata como orígenes diferentes.

Sin CORS, el frontend podría ser bloqueado al intentar consultar la API.

### Qué hace `anyHost()`
Permite solicitudes desde cualquier origen.

### Nota importante
Esto está bien para desarrollo. Más adelante, en producción, conviene restringir orígenes específicos.

---

## 14. Explicación de las rutas actuales

### Ruta `/`

```java
app.get("/", ctx -> {
    ctx.result("Backend Java funcionando");
});
```

**Qué hace:**
Devuelve texto plano.

**Para qué sirve:**
Confirmar que el servidor está vivo.

**Respuesta esperada:**

```text
Backend Java funcionando
```

---

### Ruta `/favicon.ico`

```java
app.get("/favicon.ico", ctx -> {
    ctx.status(204);
});
```

**Qué hace:**
Responde sin contenido.

**Para qué sirve:**
Evitar el error `404` que los navegadores suelen lanzar cuando buscan automáticamente un favicon.

**Respuesta esperada:**
Sin contenido, con código `204`.

---

### Ruta `/api/saludo`

```java
app.get("/api/saludo", ctx -> {
    ctx.json(Map.of(
            "mensaje", "Hola desde el backend Java",
            "estado", "ok",
            "hora", LocalDateTime.now().toString()));
});
```

**Qué hace:**
Devuelve una respuesta JSON.

**Para qué sirve:**
Es la primera API de prueba que luego consumirá React.

**Respuesta esperada:**

```json
{
  "hora": "2026-04-17T00:46:59.280012400",
  "mensaje": "Hola desde el backend Java",
  "estado": "ok"
}
```

---

## 15. Cómo ejecutar el backend

Desde la carpeta `backend-java`, usa:

```bash
mvn compile exec:java
```

### Qué hace este comando

- compila el proyecto
- ejecuta la clase `com.brandon.Main`
- levanta el servidor local

---

## 16. Cómo probar si está funcionando

### Probar la raíz

Abre en navegador:

```text
http://localhost:8080/
```

Debe mostrar:

```text
Backend Java funcionando
```

### Probar la API

Abre en navegador:

```text
http://localhost:8080/api/saludo
```

Debe devolver un JSON similar a este:

```json
{
  "hora": "2026-04-17T00:46:59.280012400",
  "mensaje": "Hola desde el backend Java",
  "estado": "ok"
}
```

---

## 17. Qué problemas ya se resolvieron en esta configuración

Con lo que ya agregaste, quedaron resueltos estos puntos:

### 17.1 No usar `.jar` manuales
Las librerías se descargan desde Maven.

### 17.2 Poder responder JSON
Se resolvió agregando `jackson-databind`.

### 17.3 Permitir conexión desde React
Se resolvió con CORS habilitado.

### 17.4 Tener un punto de entrada claro
Se resolvió usando `Main.java`.

### 17.5 Poder ejecutar fácil el backend
Se resolvió con `exec-maven-plugin`.

---

## 18. Qué vendría después en el backend

Una vez que esta base funciona, el siguiente crecimiento normal sería:

- separar rutas en controladores
- crear paquetes `controller`, `service`, `dao`, `model`, `config`, `util`
- conectar una base de datos
- agregar endpoints POST, PUT y DELETE
- validar datos
- manejar errores mejor
- consumir APIs externas si hace falta

Una estructura futura podría ser:

```text
backend-java/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── brandon/
        │           ├── Main.java
        │           ├── controller/
        │           ├── service/
        │           ├── dao/
        │           ├── model/
        │           ├── config/
        │           └── util/
        └── resources/
```

---

## 19. Resumen rápido

### Herramientas usadas

- **Java:** lenguaje del backend
- **Maven:** gestiona dependencias y ejecución
- **Javalin:** framework web liviano
- **SLF4J Simple:** logging en consola
- **Jackson Databind:** conversión a JSON

### Archivos clave

- `pom.xml` → configuración de Maven
- `Main.java` → inicio del backend

### Ruta principal de prueba

```text
http://localhost:8080/api/saludo
```

---

## 20. Comandos útiles

### Ejecutar backend

```bash
mvn compile exec:java
```

### Limpiar y volver a compilar

```bash
mvn clean compile exec:java
```

### Descargar dependencias y compilar

```bash
mvn clean install
```

---

## 21. Conclusión

Con esta configuración ya tienes un backend Java funcional para un proyecto de escritorio moderno.

Esta base permite:

- levantar un servidor local
- devolver JSON
- conectarse con React
- seguir creciendo a una arquitectura más ordenada

Es una base simple, clara y buena para empezar antes de pasar a la parte de frontend con React + Vite + Tailwind y luego a Electron.
