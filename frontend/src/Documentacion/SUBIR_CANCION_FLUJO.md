# SUBIR CANCION - FLUJO TECNICO

---

## 1. OBJETIVO DE LA FUNCIONALIDAD

Esta funcionalidad sirve para registrar una cancion nueva desde el panel de administracion.

Permite:

- escribir el titulo de la cancion;
- escribir la letra, si existe;
- seleccionar el grupo musical al que pertenece;
- seleccionar uno o varios generos musicales;
- subir el archivo de audio;
- obtener la duracion del audio desde el frontend;
- enviar todo al backend;
- guardar la cancion en la base de datos;
- guardar la relacion entre cancion y generos;
- guardar la ruta publica del audio en `link_audio`.

---

## 2. ARCHIVOS PRINCIPALES INVOLUCRADOS

### FRONTEND

- `frontend/src/pages/Home.jsx`
  - Usa el hook `useMusica`.
  - Pasa `guardarMusica` al modal `ModalPlaylist`.

- `frontend/src/components/modals/ModalPlaylist.jsx`
  - Muestra el modal de gestion.
  - En la pestana de administrador renderiza `GestionGrupoAndMusica`.
  - Pasa `onGuardarMusica` hacia abajo.

- `frontend/src/components/modals/contents/gestion/GestionGrupoAndMusica.jsx`
  - Contiene los formularios de registrar grupo y registrar musica.
  - Pasa `grupos`, `generos` y `onGuardarMusica` a `RegistrarMusicaForm`.

- `frontend/src/components/modals/contents/gestion/RegistrarMusicaForm.jsx`
  - Es el formulario principal para subir una cancion.
  - Guarda en estados el titulo, letra, grupo, generos, duracion y archivo de audio.
  - Al registrar, arma un objeto `datosMusica` y llama a `onGuardarMusica`.

- `frontend/src/components/modals/contents/gestion/UploadBox.jsx`
  - Componente reutilizable para seleccionar archivos.
  - Si `type="music"`, acepta audio, genera preview y calcula duracion con `Audio`.
  - Si `type="image"`, funciona para imagenes, por ejemplo en grupos.

- `frontend/src/hooks/useMusica.js`
  - Expone `guardarMusica`.
  - Llama a `crearMusicaConAudioApi`.
  - Si el backend responde con una musica, la agrega al estado local.

- `frontend/src/api/musicaApi.js`
  - Crea el `FormData`.
  - Envia el POST a `/api/musica/crear-con-audio`.

- `frontend/src/api/axiosClient.js`
  - Configura Axios con `VITE_API_URL`.
  - Agrega el token si existe en `localStorage`.

### BACKEND

- `api-node/src/app.js`
  - Monta las rutas de musica en `/api/musica`.
  - Sirve archivos estaticos desde `/media`.

- `api-node/src/routes/musica.routes.js`
  - Define `POST /api/musica/crear-con-audio`.
  - Usa `uploadMusica.single("audio")`.

- `api-node/src/middlewares/uploadMusica.middleware.js`
  - Configura Multer para recibir el archivo de audio.
  - Usa el campo `audio`.
  - Busca el grupo con `grupo_id`.
  - Guarda el audio en `/media/musicbh/{carpeta_slug}/canciones/`.

- `api-node/src/controllers/musica.controller.js`
  - Valida `titulo`, `grupo_id` y `req.file`.
  - Procesa `generos_ids`.
  - Busca el grupo.
  - Crea el `link_audio`.
  - Llama al modelo para insertar en base de datos.

- `api-node/src/models/musica.model.js`
  - Inserta la cancion en `musica`.
  - Inserta las relaciones en `musica_generos_m`.
  - Usa transacciones para evitar datos incompletos.

- `api-node/src/models/grupo.model.js`
  - Permite buscar el grupo musical por id.
  - Se usa para obtener `carpeta_slug`.

- `api-node/src/utils/slug.js`
  - Convierte textos como titulos o nombres en nombres seguros para carpetas/archivos.

- `musicBH.sql`
  - Define las tablas principales: `musica`, `grupos_musicales`, `generos_musicales` y `musica_generos_m`.

---

## 3. FLUJO GENERAL DE DATOS

1. El usuario abre el modal de playlists desde `Home.jsx`.
2. En `ModalPlaylist.jsx`, entra a la vista de administrador.
3. `GestionGrupoAndMusica.jsx` muestra el formulario `RegistrarMusicaForm.jsx`.
4. El usuario llena titulo, letra, grupo y generos.
5. El usuario selecciona un archivo de audio en `UploadBox.jsx`.
6. `UploadBox.jsx` guarda el archivo como `File` y calcula su duracion.
7. `RegistrarMusicaForm.jsx` guarda esos valores en estados.
8. Al presionar registrar, se crea un objeto `datosMusica`.
9. `Home.jsx` recibe esos datos mediante `guardarMusica`.
10. `useMusica.js` llama a `crearMusicaConAudioApi`.
11. `musicaApi.js` convierte los datos en `FormData`.
12. El `FormData` viaja al backend por POST.
13. El backend recibe el campo de archivo `audio`.
14. Multer procesa la subida del archivo.
15. El controller valida datos y manda guardar la cancion.
16. El modelo inserta datos en la base de datos.
17. El frontend recibe la respuesta y agrega la nueva cancion al estado local.

---

## 4. INPUTS DEL FORMULARIO

En `RegistrarMusicaForm.jsx` se capturan estos datos:

- `titulo`
  - Sale del input "Titulo de la cancion".
  - Viaja como `titulo`.

- `letra`
  - Sale del textarea "Letra de la cancion".
  - Viaja como `letra`.

- `grupo_id`
  - Sale del componente `SelectGrupoBox`.
  - Se guarda como `selectedGrupo.id`.
  - Viaja como `grupo_id`.

- `generos_ids`
  - Sale del componente `SelectGenerosBox`.
  - Se guarda como array de ids.
  - En `musicaApi.js` viaja como texto JSON usando `JSON.stringify`.

- `duracion_segundos`
  - La calcula `UploadBox.jsx` cuando el archivo es musica.
  - Se muestra en un input de solo lectura.
  - Viaja como `duracion_segundos`.

- `audio`
  - Sale del input file dentro de `UploadBox.jsx`.
  - Se guarda como `archivoAudio`.
  - Viaja como archivo dentro de `FormData`.

---

## 5. COMO SE SUBE EL ARCHIVO DE MUSICA

Se usa `FormData` porque una cancion no es solo texto. Tambien incluye un archivo real de audio.

Un JSON normal sirve para datos simples como strings, numeros o arrays, pero no es la forma correcta de enviar archivos binarios. Para eso se usa `multipart/form-data`, y en frontend se arma con `FormData`.

Ejemplo real basado en `frontend/src/api/musicaApi.js`:

```js
const formData = new FormData();

formData.append("titulo", datosMusica.titulo);
formData.append("letra", datosMusica.letra || "");
formData.append("duracion_segundos", datosMusica.duracion_segundos);
formData.append("grupo_id", datosMusica.grupo_id);
formData.append("generos_ids", JSON.stringify(datosMusica.generos_ids || []));
formData.append("audio", datosMusica.audio);
```

El nombre importante es:

```txt
audio
```

Ese nombre debe coincidir con el backend:

```js
uploadMusica.single("audio")
```

Si el frontend enviara el archivo con otro nombre, el backend no lo encontraria en `req.file`.

### DIFERENCIA CON SUBIR IMAGEN

`UploadBox.jsx` sirve para musica e imagen, pero cambia segun `type`:

- `type="music"`
  - acepta `.mp3`, `.wav`, `.m4a` y `audio/*`;
  - muestra boton de preview/play;
  - calcula duracion con `Audio`;
  - envia el archivo como `audio`.

- `type="image"`
  - acepta `image/*`;
  - muestra preview visual con `<img>`;
  - no calcula duracion.

---

## 6. COMO SE OBTIENE LA DURACION DE LA CANCION

La duracion se obtiene en el frontend, dentro de `UploadBox.jsx`.

Cuando el usuario selecciona un archivo de musica:

1. Se crea una URL temporal con `URL.createObjectURL(file)`.
2. Se crea un objeto `Audio`.
3. Se asigna esa URL al audio.
4. Se espera el evento `loadedmetadata`.
5. Se lee `audio.duration`.
6. Se convierte a segundos con `Math.floor`.
7. Se envia al formulario como `duracionSegundos`.

Fragmento clave:

```js
const audio = new Audio();
audio.src = preview;

audio.addEventListener("loadedmetadata", () => {
  const duracionSegundos = Math.floor(audio.duration);

  onFileChange({
    file,
    duracionSegundos,
  });
});
```

Luego `RegistrarMusicaForm.jsx` guarda esa duracion:

```js
setArchivoAudio(file);
setDuracion(String(duracionSegundos));
```

Y al registrar:

```js
duracion_segundos: Number(duracion) || 0
```

Actualmente el backend recibe la duracion desde el frontend. No se ve una libreria backend que calcule automaticamente la duracion del audio.

---

## 7. ENDPOINT USADO

### CREAR MUSICA CON AUDIO

```txt
POST /api/musica/crear-con-audio
```

En frontend se llama asi:

```js
axiosClient.post("/api/musica/crear-con-audio", formData)
```

Como `axiosClient.js` usa `VITE_API_URL`, la URL final queda:

```txt
VITE_API_URL + /api/musica/crear-con-audio
```

### RECIBE

Recibe `multipart/form-data` con:

- `titulo`
- `letra`
- `duracion_segundos`
- `grupo_id`
- `generos_ids`
- `audio`

### RESPONDE

Si todo sale bien, responde con estado `201`:

```json
{
  "mensaje": "Cancion subida correctamente",
  "musica": {
    "id": 1,
    "titulo": "Nombre de la cancion",
    "letra": "...",
    "link_audio": "http://localhost:3000/media/musicbh/grupo/canciones/cancion.mp3",
    "duracion_segundos": 200,
    "grupo_id": 1,
    "generos": [],
    "generos_ids": []
  }
}
```

### POSIBLES ERRORES

- `400`
  - faltan `titulo`, `grupo_id` o `audio`;
  - `generos_ids` no es un array valido;
  - `duracion_segundos` no es numero valido;
  - error de Multer al subir audio.

- `404`
  - el grupo musical no existe.

- `409`
  - ya existe un audio con ese titulo en la carpeta del grupo.

- `500`
  - error interno al guardar archivo o insertar en base de datos.

### NOTA IMPORTANTE SOBRE EL CODIGO ACTUAL

En el codigo actual hay una diferencia a revisar:

- `uploadMusica.middleware.js` usa `multer.diskStorage`, por lo que Multer guarda el archivo directamente en disco.
- `musica.controller.js`, en `guardarAudioSubido`, intenta usar `file.buffer`, que normalmente existe cuando Multer usa `memoryStorage`.

Esto puede causar un problema si el archivo ya llega guardado en disco y no trae `buffer`. No se cambio nada aqui, solo queda documentado porque forma parte del flujo real actual.

---

## 8. BASE DE DATOS

Las tablas principales estan en `musicBH.sql`.

### `musica`

Guarda los datos principales de la cancion:

- `id`
- `titulo`
- `letra`
- `link_audio`
- `duracion_segundos`
- `grupo_id`

El insert ocurre en `api-node/src/models/musica.model.js`.

### `grupos_musicales`

Guarda los grupos musicales:

- `id`
- `imagen_url`
- `nombre`
- `carpeta_slug`

`grupo_id` conecta la cancion con esta tabla. Ademas, `carpeta_slug` ayuda a decidir en que carpeta guardar el audio.

### `generos_musicales`

Guarda la lista maestra de generos:

- `id`
- `nombre`

### `musica_generos_m`

Guarda la relacion entre canciones y generos:

- `musica_id`
- `genero_id`

Si una cancion tiene tres generos, se insertan tres filas en esta tabla.

---

## 9. DIAGRAMA SIMPLE DEL FLUJO

```txt
Formulario React
   ↓
RegistrarMusicaForm.jsx
   ↓
UploadBox.jsx
   ↓
Objeto datosMusica
   ↓
useMusica.js
   ↓
musicaApi.js
   ↓
FormData
   ↓
axiosClient.js
   ↓
POST /api/musica/crear-con-audio
   ↓
musica.routes.js
   ↓
uploadMusica.middleware.js
   ↓
musica.controller.js
   ↓
musica.model.js
   ↓
Base de datos
   ↓
Respuesta al Frontend
```

---

## 10. RESUMEN FACIL

Subir una cancion significa juntar datos de texto y un archivo de audio.

El formulario guarda el titulo, letra, grupo, generos y archivo. `UploadBox.jsx` calcula la duracion usando el navegador. Luego `musicaApi.js` mete todo dentro de un `FormData`, porque el archivo de audio no debe viajar como JSON normal.

El backend recibe ese `FormData` en `POST /api/musica/crear-con-audio`. El archivo debe llamarse `audio`. Despues se guarda la cancion en la tabla `musica` y sus generos en `musica_generos_m`.

Idea clave para mi yo del futuro: el frontend prepara la cancion, `FormData` la transporta, Multer recibe el archivo y el modelo guarda los datos en MySQL/MariaDB.
