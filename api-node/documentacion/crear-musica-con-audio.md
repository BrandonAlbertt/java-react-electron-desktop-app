# Crear musica con audio

Este documento explica como funciona la creacion de una cancion con subida de audio en el backend Node.js + Express + Multer + MariaDB/MySQL + Docker.

La funcionalidad recibe datos de la cancion desde `form-data` y un archivo de audio en el campo `audio`. El backend usa `grupo_id` para buscar el grupo musical, obtiene su `carpeta_slug`, guarda el audio dentro de la carpeta de canciones de ese grupo, registra la musica en la tabla `musica`, guarda sus generos en `musica_generos_m` y responde con JSON.

## Flujo general

La cancion siempre se guarda dentro del grupo seleccionado. Por eso el dato clave no es el nombre visible del grupo, sino `grupo_id`. Con ese id el backend consulta `grupos_musicales`, obtiene `carpeta_slug` y construye la ruta fisica correcta.

```text
Frontend/Postman
  -> Route
  -> Middleware Multer
  -> Buscar grupo
  -> Obtener carpeta_slug
  -> Guardar audio
  -> Controller
  -> Model
  -> BD
  -> Respuesta JSON
```

## Archivos involucrados

| Archivo | Que hace |
| --- | --- |
| `src/routes/musica.routes.js` | Define `POST /api/musica/crear-con-audio` y ejecuta el middleware de subida antes del controller. |
| `src/controllers/musica.controller.js` | Valida datos, busca el grupo, guarda el audio fisico, genera `link_audio`, llama al model y responde JSON. |
| `src/models/musica.model.js` | Consulta grupos, inserta musica, inserta generos y usa transacciones para mantener consistencia. |
| `src/middlewares/uploadMusica.middleware.js` | Configura Multer para aceptar audio, limitar tamaño y entregar el archivo en memoria. |
| `src/models/grupo.model.js` | Contiene consultas de grupos; conceptualmente representa de donde sale `carpeta_slug`. En musica se usa una consulta equivalente desde `musica.model.js`. |
| `src/utils/slug.js` | Convierte el titulo en un nombre seguro para archivo. |
| `src/app.js` | Monta `musica.routes.js` en `/api/musica` y sirve `/media` como carpeta publica. |
| `.env` | Define `MEDIA_ROOT=/media` y `PUBLIC_URL=http://rasb-brandon.local:3000`. |
| `docker-compose.yml` | Monta `/home/brandon/media` del servidor dentro del contenedor como `/media`. |

## Variables importantes

| Variable | Donde aparece | Ejemplo | Para que sirve |
| --- | --- | --- | --- |
| `titulo` | `req.body.titulo` | `Aversarios de Vida` | Nombre visible de la cancion. |
| `tituloSlug` | `crearSlug(titulo)` | `aversarios_de_vida` | Base del nombre fisico del archivo. |
| `grupo_id` | `req.body.grupo_id` | `11` | Id del grupo seleccionado en la BD. |
| `grupo` | Controller/model | `{ id: 11, nombre: "STARLA", carpeta_slug: "starla" }` | Registro del grupo encontrado por `grupo_id`. |
| `carpeta_slug` | `grupo.carpeta_slug` | `starla` | Carpeta estable del grupo. |
| `folderPath` | Controller | `/media/musicbh/starla/canciones` | Carpeta fisica donde se guarda el audio. |
| `link_audio` | Controller/model | `http://rasb-brandon.local:3000/media/musicbh/starla/canciones/aversarios_de_vida.mp3` | URL publica guardada en `musica.link_audio`. |
| `generos_ids` | `req.body.generos_ids` | `[1,2]` o `"[1,2]"` | Generos que se insertan en `musica_generos_m`. |
| `MEDIA_ROOT` | `.env` | `/media` | Raiz fisica para guardar archivos dentro de Docker. |
| `PUBLIC_URL` | `.env` | `http://rasb-brandon.local:3000` | Base para construir URLs publicas. |

## Tablas involucradas

| Tabla | Para que se usa |
| --- | --- |
| `musica` | Guarda los datos principales de la cancion: `titulo`, `letra`, `link_audio`, `duracion_segundos`, `grupo_id`. |
| `grupos_musicales` | Permite buscar el grupo por `grupo_id` y obtener `carpeta_slug`. |
| `musica_generos_m` | Tabla relacion que conecta una cancion con uno o varios generos. |
| `generos_musicales` | Tabla maestra de generos; se usa al listar u obtener canciones para devolver nombres de generos. |

## Ejemplo con STARLA

Si el usuario registra:

| Dato | Valor |
| --- | --- |
| Titulo | `Aversarios de Vida` |
| Grupo seleccionado | `STARLA` |
| `grupo_id` | `11` |
| `carpeta_slug` del grupo | `starla` |

El sistema genera:

| Elemento | Resultado |
| --- | --- |
| Ruta fisica | `/media/musicbh/starla/canciones/aversarios_de_vida.mp3` |
| URL publica | `http://rasb-brandon.local:3000/media/musicbh/starla/canciones/aversarios_de_vida.mp3` |

## Prueba en Postman

| Campo | Valor |
| --- | --- |
| Metodo | `POST` |
| URL | `http://rasb-brandon.local:3000/api/musica/crear-con-audio` |
| Body | `form-data` |
| Campo texto | `titulo` = `Aversarios de Vida` |
| Campo texto | `letra` = `letra demo` |
| Campo texto | `duracion_segundos` = `220` |
| Campo texto | `grupo_id` = `11` |
| Campo texto | `generos_ids` = `[1,2]` |
| Campo archivo | `audio` = seleccionar `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg` o `.webm` |

Importante: el campo archivo debe llamarse exactamente `audio`, porque la ruta usa `uploadMusica.single("audio")`.

## Respuesta JSON esperada

```json
{
  "mensaje": "Cancion subida correctamente",
  "musica": {
    "id": 7,
    "titulo": "Aversarios de Vida",
    "letra": "letra demo",
    "link_audio": "http://rasb-brandon.local:3000/media/musicbh/starla/canciones/aversarios_de_vida.mp3",
    "duracion_segundos": 220,
    "grupo_id": 11,
    "grupo": "STARLA",
    "imagen_grupo": "http://rasb-brandon.local:3000/media/musicbh/starla/starla.png",
    "carpeta_grupo": "starla",
    "generos": [
      "Avant-Folktronica",
      "Glitch-Soul"
    ],
    "generos_ids": [
      1,
      2
    ]
  }
}
```

## Como viajan los datos

| Dato | Donde nace | Como se usa |
| --- | --- | --- |
| `req.body.titulo` | Llega desde `form-data`. | Se usa como titulo visible y para crear el nombre fisico del audio. |
| `req.body.grupo_id` | Llega desde `form-data`. | Se usa para buscar el grupo en `grupos_musicales`. |
| `req.body.generos_ids` | Llega desde `form-data` o JSON. | Puede llegar como array `[1,2]` o string `"[1,2]"`; luego se inserta en `musica_generos_m`. |
| `req.file` | Lo crea Multer al recibir `audio`. | Contiene el archivo en memoria, su nombre original, mimetype y buffer. |
| `req.grupo` | Patron comun en middlewares. | En esta version no se setea `req.grupo`; el controller usa `const grupo = await musicaModel.obtenerGrupoPorId(grupo_id)`. |

## Fragmentos importantes

### Route `crear-con-audio`

```js
router.post(
    "/crear-con-audio",
    subirAudioMusica,
    crearMusicaConAudio
);
```

La ruta completa queda:

```text
POST /api/musica/crear-con-audio
```

porque `app.js` monta las rutas asi:

```js
app.use("/api/musica", musicaRoutes);
```

### Middleware `uploadMusica.single("audio")`

```js
function subirAudioMusica(req, res, next) {
    uploadMusica.single("audio")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                mensaje: "Error al subir audio",
                error: error.message,
            });
        }

        next();
    });
}
```

El middleware valida tipo de audio y limite de tamaño. En la version actual usa `memoryStorage`, por eso el controller guarda el archivo con `fs.writeFileSync`.

```js
module.exports = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
});
```

### Busqueda del grupo usando `grupo_id`

```js
const grupo = await musicaModel.obtenerGrupoPorId(grupo_id);

if (!grupo) {
    return res.status(404).json({
        mensaje: "Grupo musical no encontrado",
    });
}
```

La consulta busca en `grupos_musicales`:

```js
const [rows] = await db.query(`
    SELECT
        id,
        imagen_url,
        nombre,
        carpeta_slug
    FROM grupos_musicales
    WHERE id = ?
`, [id]);
```

### Uso de `grupo.carpeta_slug`

```js
if (!grupo.carpeta_slug) {
    const error = new Error("El grupo no tiene carpeta_slug configurado");
    error.statusCode = 400;
    throw error;
}
```

Sin `carpeta_slug`, el backend no sabe en que carpeta fisica guardar el audio.

### Creacion de ruta fisica con `path.join`

```js
const cancionesPath = path.join(
    MEDIA_ROOT,
    "musicbh",
    grupo.carpeta_slug,
    "canciones"
);
```

Ejemplo final:

```text
/media/musicbh/starla/canciones
```

### Renombrado del audio con `crearSlug(titulo)`

```js
function crearNombreAudio(titulo, extension) {
    const tituloSlug = crearSlug(titulo);

    if (!tituloSlug) {
        throw new Error("El titulo no genera un nombre de archivo valido");
    }

    return `${tituloSlug}${extension || ".mp3"}`;
}
```

Ejemplo:

| Titulo | Archivo |
| --- | --- |
| `Aversarios de Vida` | `aversarios_de_vida.mp3` |

### Guardado del archivo fisico

```js
fs.mkdirSync(cancionesPath, {
    recursive: true,
});

fs.writeFileSync(archivoPath, file.buffer);
```

`recursive: true` asegura que la carpeta exista antes de guardar el audio.

### Generacion de `link_audio`

```js
function crearLinkAudio(carpetaSlug, filename) {
    return `${PUBLIC_URL}/media/musicbh/${carpetaSlug}/canciones/${filename}`;
}
```

Ejemplo:

```text
http://rasb-brandon.local:3000/media/musicbh/starla/canciones/aversarios_de_vida.mp3
```

### Insert en tabla `musica`

```js
const [result] = await connection.query(`
    INSERT INTO musica
        (titulo, letra, link_audio, duracion_segundos, grupo_id)
    VALUES (?, ?, ?, ?, ?)
`, [titulo, letra, link_audio, duracion_segundos, grupo_id]);
```

Se guarda primero la cancion principal para obtener su `id`.

### Insert en tabla `musica_generos_m`

```js
const valores = generos_ids.map((generoId) => [musicaId, generoId]);

await connection.query(`
    INSERT INTO musica_generos_m (musica_id, genero_id)
    VALUES ?
`, [valores]);
```

Asi una cancion puede quedar relacionada con varios generos.

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

Esto conecta la carpeta real del servidor con la carpeta interna del contenedor:

| Ruta | Significado |
| --- | --- |
| `/home/brandon/media` | Carpeta real donde quedan los archivos en el servidor. |
| `/media` | Ruta que ve Node.js dentro del contenedor Docker. |

El volumen no debe estar como `:ro`:

```yaml
# no usar para subir audios
- /home/brandon/media:/media:ro
```

`:ro` significa read-only. Si el volumen esta en solo lectura, el backend no podra crear carpetas ni guardar audios.

## Por que la cancion se guarda dentro del grupo seleccionado

Cada grupo musical tiene su propia carpeta estable:

```text
/media/musicbh/<carpeta_slug>/
```

Dentro de esa carpeta existe `canciones/`:

```text
/media/musicbh/<carpeta_slug>/canciones/
```

Cuando una cancion se crea con `grupo_id = 11`, el backend busca ese grupo, obtiene `carpeta_slug = starla` y guarda el audio aqui:

```text
/media/musicbh/starla/canciones/
```

Esto mantiene ordenado el sistema de archivos y evita mezclar canciones de diferentes grupos.

## Por que se usa `grupo_id` y no el nombre del grupo

El nombre visible puede cambiar, repetirse o tener mayusculas y espacios. Por ejemplo:

```text
STARLA
Starla
Starla Oficial
```

En cambio, `grupo_id` identifica un registro exacto en la base de datos. Con ese id se obtiene el `carpeta_slug` correcto. Esto evita guardar una cancion en una carpeta equivocada por escribir mal el nombre del grupo.

Buena regla:

```text
grupo_id -> buscar grupo -> usar carpeta_slug -> guardar audio
```

## Eliminacion de musica

Al eliminar una cancion, el backend debe limpiar base de datos y archivo fisico.

El model elimina en transaccion:

```js
DELETE FROM lista_musica_m
WHERE musica_id = ?
```

```js
DELETE FROM musica_generos_m
WHERE musica_id = ?
```

```js
DELETE FROM musica
WHERE id = ?
```

Despues el controller intenta borrar el archivo fisico usando el `link_audio` guardado:

```js
fs.rmSync(archivoPath, {
    force: true,
});
```

`force: true` ayuda a que no falle si el archivo ya no existe fisicamente.

## Buenas practicas y advertencias

| Tema | Recomendacion |
| --- | --- |
| Validar formato de audio | Mantener validacion de mimetype y extension: MP3, WAV, M4A, AAC, OGG o WEBM. |
| Evitar nombres duplicados | Si ya existe `aversarios_de_vida.mp3` en el grupo, responder error antes de pisar el archivo. |
| Canciones con mismo titulo | Definir una regla: rechazar duplicado, agregar sufijo, o permitir solo si cambia grupo. |
| Validar `carpeta_slug` | Si el grupo no tiene `carpeta_slug`, no se puede construir una ruta confiable. |
| Archivo fisico inexistente | Al editar o eliminar, no romper la API si el archivo ya fue borrado manualmente. |
| Usar transacciones | Insertar `musica` y `musica_generos_m` debe ser una operacion consistente. |
| Limpiar archivos si falla BD | Si el audio se guardo pero falla el insert, borrar el archivo para no dejar basura fisica. |
| Reconstruir Docker | Si cambias codigo backend, ejecutar `docker compose up -d --build`. |
| Revisar permisos | `/home/brandon/media` debe permitir escritura al contenedor. |
| Mantener `PUBLIC_URL` correcto | El frontend reproduce el audio desde `link_audio`, asi que debe apuntar al servidor real. |

## Resumen corto

Crear musica con audio prepara una relacion entre base de datos y sistema de archivos:

```text
grupo_id
  -> grupos_musicales.carpeta_slug
  -> /media/musicbh/<carpeta_slug>/canciones/<titulo_slug>.mp3
  -> musica.link_audio
  -> musica_generos_m
```

La base de datos sabe que cancion existe, a que grupo pertenece y que generos tiene. El sistema de archivos guarda el audio en la carpeta correcta del grupo. Express sirve ese archivo desde `/media` para que el frontend pueda reproducirlo.
