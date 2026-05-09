# Autenticacion JWT y encriptacion de contrasenas

Este documento explica como funciona el sistema de registro, login, encriptacion de contrasenas y proteccion de rutas con JWT en el backend Node.js + Express + MariaDB/MySQL + Docker.

Nota importante sobre este proyecto: en el contexto se mencionan `auth.controller.js`, `auth.routes.js` y `bcryptjs`, pero en el codigo actual la autenticacion vive en `src/controllers/usuario.controller.js` y `src/routes/usuario.routes.js`, y la dependencia instalada es `bcrypt`. La logica es la misma que con `bcryptjs`, pero el import cambia.

## Explicacion general

El sistema nunca guarda la contrasena real del usuario. En registro, la contrasena se convierte en un hash con bcrypt y ese hash se guarda en la base de datos.

En login, el usuario envia email y contrasena. El backend busca al usuario por email, compara la contrasena enviada contra el hash guardado usando bcrypt y, si coincide, genera un JWT firmado con `JWT_SECRET`.

Ese token se devuelve al frontend. Luego el frontend lo envia en cada ruta privada usando:

```http
Authorization: Bearer TOKEN
```

El middleware `auth.middleware.js` verifica el token con `jwt.verify`. Si el token es valido, guarda los datos decodificados en `req.usuario` y deja continuar la peticion.

## Diagrama de login

```text
Frontend
  -> Login
  -> Controller
  -> BD
  -> bcrypt.compare
  -> JWT.sign
  -> Token
  -> Frontend
```

## Archivos involucrados

| Archivo | Que hace |
| --- | --- |
| `src/controllers/usuario.controller.js` | Contiene registro, login, edicion, listado y eliminacion de usuarios. Aqui se llama a bcrypt y JWT mediante servicios. |
| `src/routes/usuario.routes.js` | Define rutas publicas (`POST /api/usuarios`, `POST /api/usuarios/login`) y rutas protegidas con `authMiddleware`. |
| `src/models/usuario.model.js` | Consulta e inserta usuarios en MariaDB/MySQL. Guarda `contrasena` como hash, no texto plano. |
| `src/middlewares/auth.middleware.js` | Lee `Authorization: Bearer TOKEN`, verifica el JWT y agrega `req.usuario`. |
| `src/services/password.service.js` | Encapsula `bcrypt.hash` y `bcrypt.compare`. |
| `src/services/token.service.js` | Encapsula `jwt.sign` y configura expiracion del token. |
| `src/app.js` | Monta las rutas de usuarios en `/api/usuarios`. |
| `.env` | Guarda secretos y configuracion: `JWT_SECRET`, `JWT_EXPIRES_IN`, puerto y datos de BD. |
| `docker-compose.yml` | Carga `.env` dentro del contenedor con `env_file`. |

## Dependencias

| Dependencia | Instalacion | Uso | Problema que resuelve |
| --- | --- | --- | --- |
| `bcrypt` | `npm install bcrypt` | `bcrypt.hash()`, `bcrypt.compare()` | Permite guardar contrasenas como hashes seguros. |
| `bcryptjs` | `npm install bcryptjs` | API similar a `bcrypt` | Alternativa escrita en JavaScript puro. Tu proyecto actual usa `bcrypt`. |
| `jsonwebtoken` | `npm install jsonwebtoken` | `jwt.sign()`, `jwt.verify()` | Crea y verifica tokens JWT para autenticar peticiones. |
| `dotenv` | `npm install dotenv` | `require("dotenv").config()` | Carga variables sensibles desde `.env` a `process.env`. |

Ejemplo de imports en tu proyecto:

```js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
```

Si otro proyecto usa `bcryptjs`, el cambio seria:

```js
const bcrypt = require("bcryptjs");
```

## Variables importantes

| Variable | Ejemplo | Que significa |
| --- | --- | --- |
| `password` / `contrasena` | `MiClave123` | Contrasena real enviada por el usuario. Nunca debe guardarse en BD. |
| `hashedPassword` / `contrasenaHash` | `$2b$10$...` | Hash generado por bcrypt y guardado en `usuarios.contrasena`. |
| `token` | `eyJhbGciOiJIUzI1Ni...` | JWT firmado que prueba que el usuario hizo login. |
| `JWT_SECRET` | `mi_clave_super_secreta_123456789` | Secreto usado para firmar y verificar tokens. |
| `expiresIn` | `2h` | Tiempo de vida del token. |
| `Authorization` | Header HTTP | Header donde el frontend envia el token. |
| `Bearer token` | `Bearer eyJ...` | Formato esperado por el middleware de autenticacion. |

## Bcrypt

Bcrypt sirve para transformar una contrasena real en un hash seguro. El hash no se puede "desencriptar" para volver a la contrasena original. En login no se descifra nada: bcrypt compara la contrasena enviada contra el hash guardado.

### Hash

Un hash es una representacion irreversible de la contrasena.

```js
const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
```

Ejemplo conceptual:

```text
Carlos123
  -> bcrypt.hash
  -> $2b$10$GxLw8...
```

### Salt

El salt es un valor aleatorio que bcrypt incorpora al hash para que dos usuarios con la misma contrasena no tengan el mismo hash.

En tu proyecto:

```js
const SALT_ROUNDS = 10;
```

Mas rounds significa mas costo computacional. Es mas resistente, pero tambien mas lento.

### Compare

Para login:

```js
const passwordOk = await bcrypt.compare(contrasenaPlano, contrasenaHash);
```

Devuelve `true` si la contrasena enviada corresponde al hash guardado.

### Por que no guardar texto plano

Si se guardara la contrasena real y alguien accede a la BD, podria leer todas las claves. Con bcrypt, el atacante solo ve hashes. Sigue siendo grave, pero no expone directamente las contrasenas reales.

## JWT

JWT significa JSON Web Token. Es un token firmado que contiene datos minimos del usuario y permite autenticar peticiones sin consultar la BD en cada request.

Un JWT tiene tres partes:

```text
header.payload.signature
```

### Payload

El payload son los datos que guardas dentro del token. En tu proyecto:

```js
{
    id: usuario.id,
    email: usuario.email,
    nombre_usuario: usuario.nombre_usuario,
}
```

No se deben guardar contrasenas, datos bancarios ni secretos en el payload.

### Secret

El secret es la clave privada del backend para firmar y verificar tokens:

```js
process.env.JWT_SECRET
```

Si alguien conoce `JWT_SECRET`, podria fabricar tokens validos. Por eso debe estar en `.env` y no en el codigo.

### Expiracion

En tu proyecto:

```js
expiresIn: process.env.JWT_EXPIRES_IN || "2h"
```

Esto significa que el token vence despues de 2 horas si `.env` tiene:

```env
JWT_EXPIRES_IN=2h
```

### Firma

La firma permite detectar si alguien modifico el token. Si el payload cambia, `jwt.verify` falla porque la firma ya no coincide.

## `.env`

`.env` contiene configuracion sensible o variable por ambiente. Tu backend lo carga con:

```js
require("dotenv").config();
```

Variables importantes:

| Variable | Uso |
| --- | --- |
| `JWT_SECRET` | Firma y verifica JWT. |
| `JWT_EXPIRES_IN` | Define cuanto dura un token. |
| `PORT` | Puerto donde corre Express. |
| `DB_HOST` | Host de MariaDB/MySQL. |
| `DB_USER` | Usuario de base de datos. |
| `DB_PASSWORD` | Contrasena de base de datos. |
| `DB_NAME` | Nombre de la base de datos. |

Ejemplo:

```env
PORT=3000

DB_HOST=rasb-brandon.local
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=musicBH

JWT_SECRET=mi_clave_super_secreta_123456789
JWT_EXPIRES_IN=2h
```

## Por que `.env` no debe subirse a GitHub

`.env` puede contener contrasenas reales, secretos JWT, credenciales de base de datos y configuracion interna. Si se sube a GitHub, cualquier persona con acceso al repo podria usar esos datos.

Buenas reglas:

```text
.env real -> no se sube
.env.example -> si se puede subir, sin secretos reales
```

Ejemplo de `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario
DB_PASSWORD=cambiar_esto
DB_NAME=mi_base
JWT_SECRET=cambiar_esto_por_un_secreto_largo
JWT_EXPIRES_IN=2h
```

## Registro de usuario

Ruta publica:

```text
POST /api/usuarios
```

### Request JSON

```json
{
  "avatar_id": 1,
  "nombre_usuario": "Carlos",
  "email": "carlos@mail.com",
  "contrasena": "Carlos123"
}
```

### Flujo

```text
req.body.contrasena
  -> hashPassword()
  -> bcrypt.hash()
  -> usuarios.contrasena
```

### Hash generado

Ejemplo aproximado:

```text
$2b$10$Q9Yh8q6CjYk2G5p6uJx3CeL8T0uF1Yv...
```

Cada vez puede ser diferente aunque la contrasena sea igual, porque bcrypt usa salt.

### Insert en BD

```js
const [result] = await db.query(`
    INSERT INTO usuarios (
        avatar_id,
        nombre_usuario,
        email,
        contrasena
    )
    VALUES (?, ?, ?, ?)
`, [avatar_id, nombre_usuario, email, contrasena]);
```

Importante: `contrasena` en esta consulta debe ser el hash, no la contrasena real.

## Login de usuario

Ruta publica:

```text
POST /api/usuarios/login
```

### Request JSON

```json
{
  "email": "carlos@mail.com",
  "contrasena": "Carlos123"
}
```

### Buscar usuario

```js
const usuarioBuscado = await usuarioModel.buscarUsuarioPorEmail(email);
```

### Comparar password

```js
const passwordOk = await comparePassword(
    contrasena,
    usuarioBuscado.contrasena
);
```

Si `passwordOk` es `false`, se responde:

```json
{
  "mensaje": "Credenciales incorrectas"
}
```

### Generar token

```js
const token = generateToken(usuarioBuscado);
```

Internamente:

```js
return jwt.sign(
    {
        id: usuario.id,
        email: usuario.email,
        nombre_usuario: usuario.nombre_usuario,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    }
);
```

### Respuesta login

```json
{
  "mensaje": "Login correcto",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 2,
    "avatar_id": 1,
    "nombre_usuario": "Carlos",
    "email": "carlos@mail.com"
  }
}
```

## Como viajan los datos

| Dato | Donde nace | Como se usa |
| --- | --- | --- |
| `req.body.email` | Lo envia el frontend en registro/login. | En login se usa para buscar el usuario en BD. |
| `req.body.password` / `req.body.contrasena` | Lo envia el frontend. | En registro se hashea; en login se compara contra el hash. |
| `token generado` | Lo crea `jwt.sign`. | Se envia al frontend y luego vuelve en `Authorization: Bearer TOKEN`. |

## Rutas protegidas

En `usuario.routes.js` hay rutas publicas y protegidas.

Publicas:

```js
router.post("/", crearUsuario);
router.post("/login", loginUsuario);
```

Protegidas:

```js
router.get("/", authMiddleware, listarUsuarios);
router.get("/:id", authMiddleware, obtenerUsuarioPorId);
router.put("/:id", authMiddleware, editarUsuario);
router.delete("/:id", authMiddleware, eliminarUsuario);
```

Para llamar una ruta protegida, el frontend debe enviar:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Middleware auth

El middleware hace tres cosas:

1. Extrae el header `Authorization`.
2. Verifica que tenga formato `Bearer TOKEN`.
3. Verifica el token con `jwt.verify`.

Ejemplo:

```js
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token no enviado",
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            mensaje: "Formato de token invalido",
        });
    }

    const token = partes[1];

    try {
        const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = usuarioDecodificado;
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token invalido o expirado",
        });
    }
}
```

Cuando el token es valido, el controller siguiente puede leer:

```js
req.usuario.id
req.usuario.email
req.usuario.nombre_usuario
```

## Expiracion del token

Con:

```env
JWT_EXPIRES_IN=2h
```

el token dura 2 horas desde que se crea.

Cuando el token expira:

1. El frontend lo envia igual en `Authorization`.
2. `jwt.verify` detecta que ya vencio.
3. El middleware responde `401`.
4. El frontend debe pedir login nuevamente o usar un sistema de refresh token si existe.

Respuesta tipica:

```json
{
  "mensaje": "Token invalido o expirado"
}
```

## Seguridad

| Riesgo | Recomendacion |
| --- | --- |
| Guardar password real | Nunca guardar contrasenas en texto plano. Guardar solo hashes bcrypt. |
| Exponer `JWT_SECRET` | Nunca escribirlo en el codigo ni subirlo a GitHub. |
| Enviar tokens por HTTP | Usar HTTPS en produccion. |
| Guardar token en `localStorage` | En produccion empresarial es mejor evaluar cookies `HttpOnly`, `Secure`, `SameSite`. |
| Devolver datos sensibles | Nunca devolver `contrasena`, hash, secretos ni datos internos. |
| Mensajes de login demasiado especificos | Usar "Credenciales incorrectas" para email inexistente y password incorrecto. |

## Docker

En `docker-compose.yml`, el servicio carga variables desde `.env`:

```yaml
env_file:
  - .env
```

Eso permite que dentro del contenedor Node.js lea:

```js
process.env.JWT_SECRET
process.env.JWT_EXPIRES_IN
process.env.DB_HOST
```

`JWT_SECRET` debe venir desde variables de entorno porque:

1. Cambia entre desarrollo y produccion.
2. No debe estar escrito en el codigo.
3. Permite rotarlo sin modificar archivos fuente.
4. Evita filtrar secretos cuando se comparte el proyecto.

## Buenas practicas

| Tema | Recomendacion |
| --- | --- |
| Validar email | Revisar formato y evitar duplicados antes de insertar. |
| Validar contrasena | Exigir longitud minima y, si aplica, numeros, letras y simbolos. |
| Usar `try/catch` | Capturar errores de BD, bcrypt y JWT para responder JSON claro. |
| Usar `async/await` | Mantiene el flujo legible con consultas y hashes asincronos. |
| No devolver informacion sensible | Omitir `contrasena` y hashes en respuestas JSON. |
| Manejar errores correctamente | Login fallido debe responder `401`; datos incompletos `400`; duplicados `409`. |
| Proteger rutas privadas | Usar `authMiddleware` antes del controller. |
| Revisar `.gitignore` | Asegurar que `.env` no se suba al repositorio. |
| Reconstruir Docker | Si cambias backend o dependencias, ejecutar `docker compose up -d --build`. |

## Resumen corto

```text
Registro:
contrasena real -> bcrypt.hash -> hash en BD

Login:
email + contrasena -> buscar usuario -> bcrypt.compare -> jwt.sign -> token

Ruta protegida:
Authorization: Bearer token -> jwt.verify -> req.usuario -> controller
```

Este sistema separa tres responsabilidades importantes: bcrypt protege contrasenas, JWT autentica peticiones, y `.env` protege secretos/configuracion fuera del codigo fuente.
