# Crear grupo musical con imagen

Este documento explica como funciona la creacion de un grupo musical con subida de imagen en el backend Node.js + Express + Multer + MariaDB/MySQL + Docker.

La funcionalidad recibe dos datos desde `form-data`: el `nombre` visible del grupo y el archivo `imagen`. Con esos datos crea una carpeta fisica estable para el grupo, guarda la imagen, prepara una carpeta interna para canciones, registra la informacion en la tabla `grupos_musicales` y responde al frontend con JSON.

## Flujo general

Cuando el frontend o Postman envia la peticion, Express la recibe en la ruta de grupos musicales. Antes de entrar al controller, Multer procesa la imagen. En ese paso se lee `req.body.nombre`, se genera el slug con `crearSlug()`, se crean las carpetas y se guarda el archivo fisico.

Luego el controller arma la URL publica de la imagen usando `PUBLIC_URL`, llama al model para insertar el grupo en MariaDB/MySQL y responde con el grupo creado.

```text
Frontend/Postman
  -> Route
  -> Middleware Multer
  -> Controller
  -> Model
  -> BD
  -> Respuesta JSON
```

## Archivos involucrados

| Archivo | Que hace |
| --- | --- |
| `src/routes/grupo.routes.js` | Define la ruta `POST /api/grupos-musicales/crear-con-imagen` y ejecuta el middleware de subida antes del controller. |
| `src/controllers/grupo.controller.js` | Valida que existan `nombre` y `req.file`, genera `imagenUrl`, llama al model y responde JSON. |
| `src/models/grupo.model.js` | Ejecuta el `INSERT` en la tabla `grupos_musicales` y devuelve el grupo creado. |
| `src/middlewares/uploadGrupo.middleware.js` | Configura Multer, valida tipo de imagen, crea carpetas y guarda la imagen fisica. |
| `src/utils/slug.js` | Convierte el nombre visible en un slug seguro para carpetas y archivos. |
| `src/app.js` | Monta `grupo.routes.js` en `/api/grupos-musicales` y sirve archivos estaticos desde `/media`. |
| `.env` | Define `MEDIA_ROOT=/media` y `PUBLIC_URL=http://rasb-brandon.local:3000`. |
| `docker-compose.yml` | Monta `/home/brandon/media` del servidor dentro del contenedor como `/media`. |

## Variables importantes

| Variable | Donde aparece | Ejemplo | Para que sirve |
| --- | --- | --- | --- |
| `nombre` | `req.body.nombre` | `STARLA` | Nombre visible del grupo que ve el usuario. |
| `carpetaSlug` | `req.carpetaSlug` | `starla` | Nombre estable para carpeta y archivo. |
| `folderPath` | Middleware Multer | `/media/musicbh/starla` | Carpeta fisica principal del grupo. |
| `cancionesPath` | Middleware Multer | `/media/musicbh/starla/canciones` | Carpeta donde luego se guardan canciones del grupo. |
| `imagenUrl` | Controller | `http://rasb-brandon.local:3000/media/musicbh/starla/starla.png` | URL publica guardada en base de datos. |
| `MEDIA_ROOT` | `.env` | `/media` | Raiz fisica donde se guardan imagenes y canciones dentro de Docker. |
| `PUBLIC_URL` | `.env` | `http://rasb-brandon.local:3000` | Base de la URL publica que consumira el frontend. |

## Tabla `grupos_musicales`

| Columna | Descripcion |
| --- | --- |
| `id` | Identificador autoincremental del grupo. |
| `imagen_url` | URL publica de la imagen del grupo. |
| `nombre` | Nombre visible del grupo musical. |
| `carpeta_slug` | Slug estable usado para la carpeta fisica del grupo. |

## Ejemplo con STARLA

Si el usuario crea un grupo con este nombre:

```text
STARLA
```

El sistema genera:

| Elemento | Resultado |
| --- | --- |
| `carpeta_slug` | `starla` |
| Carpeta fisica | `/media/musicbh/starla/` |
| Imagen | `/media/musicbh/starla/starla.png` |
| Carpeta canciones | `/media/musicbh/starla/canciones/` |
| URL publica | `http://rasb-brandon.local:3000/media/musicbh/starla/starla.png` |

## Prueba en Postman

| Campo | Valor |
| --- | --- |
| Metodo | `POST` |
| URL | `http://rasb-brandon.local:3000/api/grupos-musicales/crear-con-imagen` |
| Body | `form-data` |
| Campo texto | `nombre` = `STARLA` |
| Campo archivo | `imagen` = seleccionar imagen `.jpg`, `.png` o `.webp` |

Importante: el nombre del campo archivo debe ser exactamente `imagen`, porque la ruta usa `uploadGrupo.single("imagen")`.

## Respuesta JSON esperada

```json
{
  "mensaje": "Grupo creado correctamente",
  "grupo": {
    "id": 11,
    "imagen_url": "http://rasb-brandon.local:3000/media/musicbh/starla/starla.png",
    "nombre": "STARLA",
    "carpeta_slug": "starla"
  }
}
```

## Como viajan los datos

| Dato | Donde nace | Como se usa |
| --- | --- | --- |
| `req.body.nombre` | Llega desde `form-data`. | El middleware lo usa para generar el slug y el controller para guardar el nombre visible. |
| `req.file` | Lo crea Multer al recibir `imagen`. | El controller lo usa para confirmar que se subio imagen y para conocer el nombre final del archivo. |
| `req.carpetaSlug` | Lo crea `uploadGrupo.middleware.js`. | El controller lo usa para generar `imagenUrl` y guardar `carpeta_slug` en BD. |

## Fragmentos importantes

### Route `crear-con-imagen`

```js
router.post(
    "/crear-con-imagen",
    subirImagenGrupo,
    GrupoController.crearGrupoConImagen
);
```

Esta ruta queda disponible como:

```text
POST /api/grupos-musicales/crear-con-imagen
```

porque en `app.js` se monta asi:

```js
app.use("/api/grupos-musicales", grupoRoutes);
```

### Middleware `uploadGrupo.single("imagen")`

```js
function subirImagenGrupo(req, res, next) {
    uploadGrupo.single("imagen")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                mensaje: error.message,
            });
        }

        next();
    });
}
```

Este wrapper permite que los errores de Multer vuelvan como JSON claro, por ejemplo si falta el nombre o si el archivo no es una imagen permitida.

### Funcion `crearSlug`

```js
function crearSlug(texto = "") {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}
```

Ejemplos:

| Nombre | Slug |
| --- | --- |
| `STARLA` | `starla` |
| `Hecho de Fuego` | `hecho_de_fuego` |
| `Cancion Ñandú` | `cancion_nandu` |

### Creacion de carpetas con `fs.mkdirSync`

```js
const folderPath = path.join(
    MEDIA_ROOT,
    "musicbh",
    carpetaSlug
);

fs.mkdirSync(folderPath, {
    recursive: true,
});
```

Tambien se crea la carpeta interna para canciones:

```js
const cancionesPath = path.join(
    folderPath,
    "canciones"
);

fs.mkdirSync(cancionesPath, {
    recursive: true,
});
```

`recursive: true` permite crear carpetas aunque alguna parte de la ruta no exista todavia.

### Generacion de `imagenUrl`

```js
const imagenUrl = `${PUBLIC_URL}/media/musicbh/${carpetaSlug}/${req.file.filename}`;
```

Si `PUBLIC_URL` es `http://rasb-brandon.local:3000`, `carpetaSlug` es `starla` y el archivo se llama `starla.png`, la URL final queda:

```text
http://rasb-brandon.local:3000/media/musicbh/starla/starla.png
```

### Insert en `grupos_musicales`

```js
const [result] = await db.query(`
    INSERT INTO grupos_musicales (
        imagen_url,
        nombre,
        carpeta_slug
    )
    VALUES (?, ?, ?)
`, [
    imagen_url,
    nombre,
    carpeta_slug,
]);
```

Se usan parametros `?` para evitar concatenar valores directamente en SQL.

## Docker y archivos media

En `.env`:

```env
MEDIA_ROOT=/media
PUBLIC_URL=http://rasb-brandon.local:3000
```

En `docker-compose.yml`:

```yaml
volumes:
  - /home/brandon/media:/media
```

Esto significa:

| Ruta | Significado |
| --- | --- |
| `/home/brandon/media` | Carpeta real en el servidor o Raspberry. |
| `/media` | Carpeta visible dentro del contenedor Docker. |

El backend escribe en `/media/musicbh/starla`, pero fisicamente los archivos quedan en `/home/brandon/media/musicbh/starla` en el servidor.

No debe usarse `:ro` en este volumen para esta funcionalidad:

```yaml
# no usar para subida de archivos
- /home/brandon/media:/media:ro
```

`:ro` significa read-only. Si el volumen esta en solo lectura, Multer no podra crear carpetas ni guardar imagenes.

## Por que `nombre` es visible y `carpeta_slug` es estable

`nombre` es el texto que ve el usuario. Puede tener mayusculas, espacios o caracteres especiales:

```text
STARLA
```

`carpeta_slug` es el identificador seguro para archivos:

```text
starla
```

Conviene que `carpeta_slug` sea estable porque se usa en rutas fisicas y URLs. Si se cambia cada vez que se edita el nombre visible, podrian romperse imagenes o canciones guardadas dentro de la carpeta anterior.

Buena practica: permitir editar `nombre` para mostrar otro texto, pero no cambiar `carpeta_slug` automaticamente sin mover tambien todos los archivos relacionados.

## Buenas practicas y advertencias

| Tema | Recomendacion |
| --- | --- |
| No cambiar `carpeta_slug` sin plan | Si cambia el slug, tambien se deben mover imagenes y canciones para no romper URLs. |
| Validar imagen | El middleware ya acepta `image/jpeg`, `image/png` y `image/webp`; mantener esa validacion. |
| Evitar nombres duplicados | Antes de insertar, conviene validar si ya existe un `carpeta_slug` igual para no pisar carpetas o imagenes. |
| Manejar errores | Si falla Multer, responder JSON claro. Si falla BD luego de subir archivo, conviene borrar el archivo creado para evitar basura fisica. |
| Reconstruir Docker | Si cambias codigo backend, reconstruye el contenedor para que tome los cambios: `docker compose up -d --build`. |
| Revisar permisos | La carpeta `/home/brandon/media` debe permitir escritura al proceso del contenedor. |
| Mantener `PUBLIC_URL` correcto | El frontend usara la URL guardada en `imagen_url`; debe apuntar al host accesible por el usuario. |

## Resumen corto

Crear un grupo con imagen no solo guarda un registro en la base de datos. Tambien prepara la estructura fisica que usara la app musical:

```text
/media/musicbh/<carpeta_slug>/
  <carpeta_slug>.<extension>
  canciones/
```

Esa estructura permite que cada grupo tenga su propia imagen y su propia carpeta de canciones, usando un nombre estable y facil de servir publicamente desde Express.
