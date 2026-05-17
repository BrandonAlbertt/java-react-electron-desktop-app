# Migracion de npm a pnpm y adaptacion para Docker

Esta documentacion explica, paso a paso y con lenguaje simple, como se migro este proyecto Node.js de `npm` a `pnpm` y que cambios fueron necesarios para que la API funcione correctamente dentro de Docker.

La idea es que sirva para este proyecto `api-node` y tambien como guia reutilizable para futuros proyectos Node.js + pnpm + Docker.

---

## 1. Introduccion

### Que es npm

`npm` es el gestor de paquetes que viene incluido con Node.js.

Sirve para:

- instalar librerias
- ejecutar scripts del proyecto
- crear la carpeta `node_modules`
- guardar versiones exactas de dependencias en `package-lock.json`

Ejemplo:

```bash
npm install
npm run dev
npm start
```

Cuando un proyecto usa `npm`, normalmente tiene estos archivos:

```text
package.json
package-lock.json
node_modules/
```

### Que es pnpm

`pnpm` tambien es un gestor de paquetes para Node.js.

Hace lo mismo que `npm`, pero de una forma mas eficiente:

- instala dependencias mas rapido
- ahorra espacio en disco
- evita duplicar paquetes innecesariamente
- usa su propio archivo lock llamado `pnpm-lock.yaml`

Ejemplo:

```bash
pnpm install
pnpm dev
pnpm start
```

Cuando un proyecto usa `pnpm`, normalmente tiene estos archivos:

```text
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
node_modules/
```

### Que cambia al migrar

Migrar de `npm` a `pnpm` no es solo cambiar comandos.

Tambien cambian cosas importantes:

- `package-lock.json` deja de usarse
- se crea `pnpm-lock.yaml`
- Docker debe instalar dependencias con `pnpm`, no con `npm`
- algunas dependencias nativas, como `bcrypt`, pueden necesitar permiso para ejecutar scripts de instalacion

En este proyecto, el cambio importante fue que la API ya no debia construirse en Docker con:

```bash
npm install
```

Sino con:

```bash
corepack pnpm install --prod --frozen-lockfile
```

---

## 2. Problemas comunes al migrar

### `node_modules`

La carpeta `node_modules` contiene las librerias instaladas.

No conviene copiarla de un sistema a otro, especialmente si se usa Docker.

Ejemplo:

- `node_modules` creado en Windows puede no servir dentro de Linux
- `node_modules` creado con `npm` puede no coincidir con `pnpm`
- `node_modules` creado en una PC puede fallar en una Raspberry

Por eso, al migrar conviene borrar `node_modules` y reinstalar:

```bash
rm -rf node_modules
pnpm install
```

En Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Lockfiles

Un lockfile guarda las versiones exactas de las dependencias.

Con `npm` se usa:

```text
package-lock.json
```

Con `pnpm` se usa:

```text
pnpm-lock.yaml
```

No se deben mezclar ambos en el mismo proyecto.

Si el proyecto usa `pnpm`, lo correcto es mantener:

```text
package.json
pnpm-lock.yaml
```

Y eliminar:

```text
package-lock.json
```

### Comandos diferentes

Algunos comandos cambian:

| Accion | npm | pnpm |
| --- | --- | --- |
| Instalar dependencias | `npm install` | `pnpm install` |
| Instalar solo produccion | `npm install --omit=dev` | `pnpm install --prod` |
| Ejecutar dev | `npm run dev` | `pnpm dev` |
| Ejecutar start | `npm start` | `pnpm start` |
| Agregar paquete | `npm install paquete` | `pnpm add paquete` |
| Agregar dev dependency | `npm install -D paquete` | `pnpm add -D paquete` |

### Docker usando npm

Uno de los problemas principales fue que el proyecto ya usaba `pnpm`, pero Docker todavia estaba preparado como si el proyecto usara `npm`.

Ejemplo de problema:

```dockerfile
COPY package.json package-lock.json ./
RUN npm install
```

Eso falla o crea instalaciones incorrectas si el proyecto ya no usa `package-lock.json`.

Con `pnpm`, Docker debe copiar:

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
```

Y debe instalar con:

```dockerfile
RUN corepack enable \
    && corepack pnpm install --prod --frozen-lockfile
```

### Dependencias nativas

Una dependencia nativa es una libreria que no es solo JavaScript.

Puede necesitar compilar codigo especial para el sistema donde se instala.

Ejemplos:

- `bcrypt`
- librerias de imagenes
- librerias de audio
- conectores especiales

Estas dependencias pueden funcionar en una PC, pero fallar dentro de Docker si no se instalan correctamente.

### bcrypt

En este proyecto se usa `bcrypt`.

`bcrypt` sirve para cifrar y comparar contrasenas.

Es importante para la autenticacion porque permite guardar contrasenas de forma segura, en lugar de guardarlas como texto plano.

Pero `bcrypt` usa partes nativas. Por eso, durante la instalacion puede ejecutar scripts para preparar el paquete segun el sistema.

---

## 3. Cambios realizados en este proyecto

### Cambio en `Dockerfile`

El `Dockerfile` fue adaptado para usar `pnpm`.

Archivo:

```text
api-node/Dockerfile
```

Version actual:

```dockerfile
# Usa Node.js dentro de una imagen liviana.
FROM node:22-alpine

# Define la carpeta donde trabajara el contenedor.
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala las librerias del proyecto dentro del contenedor.
RUN corepack enable \
    && corepack pnpm install --prod --frozen-lockfile

# Copia todo el codigo de la API al contenedor.
COPY . .

# Indica que la app usa el puerto 3000.
EXPOSE 3000

# Arranca la API cuando el contenedor se ejecuta.
CMD ["corepack", "pnpm", "start"]
```

Que significa cada parte:

- `FROM node:22-alpine`: usa Node.js 22 en una imagen liviana de Linux.
- `WORKDIR /app`: crea o usa la carpeta `/app` dentro del contenedor.
- `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./`: copia los archivos necesarios para instalar dependencias.
- `corepack enable`: activa Corepack, que permite usar pnpm sin instalarlo manualmente.
- `corepack pnpm install --prod --frozen-lockfile`: instala solo dependencias de produccion respetando el lockfile.
- `COPY . .`: copia el codigo de la API.
- `EXPOSE 3000`: documenta que la API usa el puerto 3000.
- `CMD ["corepack", "pnpm", "start"]`: inicia la API.

### Cambio en `pnpm-workspace.yaml`

Archivo:

```text
api-node/pnpm-workspace.yaml
```

Version actual:

```yaml
allowBuilds:
  bcrypt: true
```

Esto le dice a `pnpm` que permita a `bcrypt` ejecutar su build durante la instalacion.

Es necesario porque `bcrypt` usa codigo nativo y pnpm bloquea algunos scripts por seguridad.

Nota importante:

En algunas versiones o documentaciones antiguas de pnpm se puede encontrar:

```yaml
onlyBuiltDependencies:
  - bcrypt
```

Pero en `pnpm 11`, el ajuste correcto usado en este proyecto es:

```yaml
allowBuilds:
  bcrypt: true
```

### Cambio en `docker-compose.yml`

Archivo:

```text
api-node/docker-compose.yml
```

Parte importante:

```yaml
env_file:
  - .env

environment:
  DB_HOST: host.docker.internal

extra_hosts:
  - "host.docker.internal:host-gateway"
```

Esto se agrego porque dentro de Docker no siempre se puede resolver un dominio local como:

```text
rasb-brandon.local
```

Desde Postman o desde el navegador puede funcionar, pero dentro del contenedor puede fallar.

Por eso:

- `PUBLIC_URL` puede seguir usando `rasb-brandon.local`
- `DB_HOST` dentro de Docker se sobreescribe con `host.docker.internal`

Asi el contenedor puede conectarse a MySQL en la maquina host donde corre Docker.

---

## 4. Explicacion del problema bcrypt

### Que paso

Al construir la imagen Docker aparecio un error parecido a este:

```text
ERR_PNPM_IGNORED_BUILDS Ignored build scripts: bcrypt@6.0.0
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

Esto significa que `pnpm` instalo la dependencia, pero no quiso ejecutar su script de build.

### Por que pnpm bloqueo bcrypt

`pnpm` tiene medidas de seguridad.

Algunas dependencias pueden ejecutar scripts durante la instalacion. Eso puede ser util, pero tambien puede ser peligroso si una dependencia maliciosa ejecuta codigo no deseado.

Por eso, pnpm puede bloquear esos builds y pedir aprobacion.

### Que significa `ERR_PNPM_IGNORED_BUILDS`

Significa:

```text
pnpm encontro una dependencia que queria ejecutar un script de build,
pero ese build no estaba aprobado.
```

En este proyecto, la dependencia era:

```text
bcrypt@6.0.0
```

### Por que bcrypt necesita compilacion

`bcrypt` trabaja con cifrado de contrasenas.

Para ser rapido y seguro, puede usar codigo nativo adaptado al sistema operativo y a la arquitectura del equipo.

Ejemplos de arquitecturas:

- Windows en PC
- Linux en Docker
- Linux ARM en Raspberry

Por eso, no basta con copiar `node_modules` desde una PC. Lo correcto es instalar dentro del contenedor.

---

## 5. Solucion aplicada

### Aprobar el build de bcrypt

Se agrego esta configuracion:

```yaml
allowBuilds:
  bcrypt: true
```

Esto permite que pnpm ejecute el build de `bcrypt` cuando instala dependencias.

### Usar `pnpm-workspace.yaml`

El archivo `pnpm-workspace.yaml` se copia al contenedor antes de instalar dependencias:

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
```

Esto es importante porque pnpm necesita leer esa configuracion antes de ejecutar:

```bash
pnpm install
```

### Copiar `pnpm-lock.yaml`

El `Dockerfile` copia:

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
```

`pnpm-lock.yaml` es necesario para que Docker instale exactamente las mismas versiones del proyecto.

### Activar Corepack

En Node.js moderno existe `corepack`.

Corepack ayuda a usar gestores como pnpm sin instalarlos manualmente.

En Docker se usa:

```dockerfile
RUN corepack enable \
    && corepack pnpm install --prod --frozen-lockfile
```

### Instalar dependencias con pnpm

La instalacion final de produccion se hace con:

```bash
corepack pnpm install --prod --frozen-lockfile
```

Significado:

- `corepack pnpm`: usa pnpm mediante Corepack.
- `install`: instala dependencias.
- `--prod`: instala solo dependencias necesarias para ejecutar la app.
- `--frozen-lockfile`: no permite que pnpm cambie el lockfile dentro de Docker.

Esto hace que el build sea mas predecible.

---

## 6. Como migrar otro proyecto de npm a pnpm

Esta guia sirve para migrar otro proyecto Node.js de `npm` a `pnpm`.

### Paso 1: Instalar pnpm

Opcion recomendada con Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Tambien se puede instalar globalmente:

```bash
npm install -g pnpm
```

### Paso 2: Borrar `node_modules`

Linux/macOS:

```bash
rm -rf node_modules
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
```

### Paso 3: Borrar `package-lock.json`

Linux/macOS:

```bash
rm package-lock.json
```

Windows PowerShell:

```powershell
Remove-Item package-lock.json
```

### Paso 4: Instalar con pnpm

```bash
pnpm install
```

Esto crea:

```text
pnpm-lock.yaml
```

### Paso 5: Probar localmente

Si antes usabas:

```bash
npm run dev
```

Ahora usa:

```bash
pnpm dev
```

Si antes usabas:

```bash
npm start
```

Ahora usa:

```bash
pnpm start
```

### Paso 6: Actualizar Dockerfile

Cambiar de npm:

```dockerfile
COPY package.json package-lock.json ./
RUN npm install --omit=dev
CMD ["npm", "start"]
```

A pnpm:

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable \
    && corepack pnpm install --prod --frozen-lockfile
CMD ["corepack", "pnpm", "start"]
```

### Paso 7: Agregar configuracion para dependencias nativas

Si usas `bcrypt`, crear o actualizar:

```text
pnpm-workspace.yaml
```

Con:

```yaml
allowBuilds:
  bcrypt: true
```

### Paso 8: Actualizar docker-compose

Verificar que el compose cargue el `.env`:

```yaml
env_file:
  - .env
```

Si la base de datos esta en la misma maquina que Docker:

```yaml
environment:
  DB_HOST: host.docker.internal

extra_hosts:
  - "host.docker.internal:host-gateway"
```

### Paso 9: Reconstruir Docker

```bash
docker compose down
docker compose up -d --build --force-recreate
```

### Paso 10: Verificar variables dentro del contenedor

```bash
docker exec api_node_musicbh printenv DB_HOST
```

Tambien puedes ver logs:

```bash
docker logs api_node_musicbh
```

---

## 7. Ejemplos reales

### Dockerfile viejo con npm

Ejemplo de como podria verse un Dockerfile antes de migrar:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Problemas:

- espera `package-lock.json`
- usa `npm install`
- no lee `pnpm-lock.yaml`
- no lee `pnpm-workspace.yaml`
- no aprovecha Corepack

### Dockerfile nuevo con pnpm

Version usada por este proyecto:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable \
    && corepack pnpm install --prod --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["corepack", "pnpm", "start"]
```

### pnpm-workspace.yaml

```yaml
allowBuilds:
  bcrypt: true
```

### docker-compose.yml

Ejemplo adaptado al proyecto:

```yaml
services:
  api-node:
    build: .
    container_name: api_node_musicbh
    restart: unless-stopped

    ports:
      - "3000:3000"

    env_file:
      - .env

    environment:
      DB_HOST: host.docker.internal

    extra_hosts:
      - "host.docker.internal:host-gateway"

    volumes:
      - /home/brandon/media:/media

    networks:
      - red_backend

networks:
  red_backend:
    external: true
```

### Comandos utiles

Instalar dependencias localmente:

```bash
pnpm install
```

Ejecutar en modo desarrollo:

```bash
pnpm dev
```

Ejecutar en modo produccion:

```bash
pnpm start
```

Construir Docker:

```bash
docker compose up -d --build
```

Reconstruir completamente:

```bash
docker compose down
docker compose up -d --build --force-recreate
```

Ver logs:

```bash
docker logs api_node_musicbh
```

Entrar al contenedor:

```bash
docker exec -it api_node_musicbh sh
```

Ver una variable de entorno dentro del contenedor:

```bash
docker exec api_node_musicbh printenv DB_HOST
```

Probar endpoint:

```bash
curl http://rasb-brandon.local:3000/api/avatares
```

---

## 8. Errores comunes

### `.env` no encontrado

Error posible:

```text
Error: missing environment variable
```

O la app inicia, pero no se conecta a la BD.

Solucion:

Verificar que exista:

```text
api-node/.env
```

Y que `docker-compose.yml` tenga:

```yaml
env_file:
  - .env
```

### Token invalido

Error:

```json
{
  "mensaje": "Token invalido o expirado"
}
```

Posibles causas:

- se esta llamando una ruta protegida sin token
- el token expiro
- el token fue firmado con otro `JWT_SECRET`
- una ruta publica fue protegida por error

Rutas publicas esperadas en este proyecto:

```text
POST /api/usuarios
POST /api/usuarios/login
```

Rutas protegidas esperadas:

```text
GET /api/usuarios
GET /api/usuarios/:id
PUT /api/usuarios/:id
DELETE /api/usuarios/:id
```

### bcrypt build failed

Error:

```text
ERR_PNPM_IGNORED_BUILDS
Ignored build scripts: bcrypt@6.0.0
```

Solucion:

Verificar `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  bcrypt: true
```

Luego reconstruir:

```bash
docker compose down
docker compose up -d --build --force-recreate
```

### El contenedor se apaga

Ver logs:

```bash
docker logs api_node_musicbh
```

Posibles causas:

- falta `.env`
- error en `package.json`
- error al instalar dependencias
- error en conexion a MySQL
- puerto ocupado

### Lockfile mismatch

Error posible:

```text
Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
```

Significa que `package.json` y `pnpm-lock.yaml` no coinciden.

Solucion local:

```bash
pnpm install
```

Luego reconstruir Docker:

```bash
docker compose up -d --build
```

### ENOTFOUND con DB_HOST

Error:

```json
{
  "code": "ENOTFOUND",
  "hostname": "rasb-brandon.local"
}
```

Significa que dentro del contenedor Docker no se puede resolver el nombre `rasb-brandon.local`.

Solucion aplicada:

```yaml
environment:
  DB_HOST: host.docker.internal

extra_hosts:
  - "host.docker.internal:host-gateway"
```

Verificar:

```bash
docker exec api_node_musicbh printenv DB_HOST
```

Debe responder:

```text
host.docker.internal
```

### ECONNREFUSED con MySQL

Si el error cambia a:

```text
ECONNREFUSED
```

Significa que el contenedor ya encontro el host, pero MySQL no acepto la conexion.

Posibles causas:

- MySQL no esta encendido
- MySQL escucha solo en `127.0.0.1`
- el puerto `3306` no esta abierto
- el usuario de MySQL no tiene permisos para conexiones externas

---

## 9. Checklist final

Antes de desplegar, revisar:

- [ ] `package-lock.json` eliminado si el proyecto ya usa pnpm
- [ ] `pnpm-lock.yaml` creado
- [ ] `node_modules` no se copia al contenedor
- [ ] `.dockerignore` incluye `node_modules`
- [ ] `Dockerfile` usa `pnpm`, no `npm`
- [ ] `Dockerfile` copia `pnpm-lock.yaml`
- [ ] `Dockerfile` copia `pnpm-workspace.yaml`
- [ ] `Dockerfile` ejecuta `corepack enable`
- [ ] `Dockerfile` instala con `corepack pnpm install --prod --frozen-lockfile`
- [ ] `pnpm-workspace.yaml` aprueba `bcrypt`
- [ ] `.env` existe en la maquina donde se ejecuta Docker
- [ ] `docker-compose.yml` carga `env_file: .env`
- [ ] `DB_HOST` funciona desde dentro del contenedor
- [ ] `PUBLIC_URL` apunta a la URL que usara el navegador o Postman
- [ ] `docker compose up -d --build` funciona
- [ ] `docker logs api_node_musicbh` no muestra errores criticos
- [ ] `GET /api/avatares` responde correctamente

---

## Notas adicionales de buenas practicas

### No subir `.env` a repositorios publicos

El archivo `.env` puede contener:

- contrasenas
- claves JWT
- datos de conexion a BD

No deberia subirse a GitHub si el repositorio es publico.

Se recomienda tener un archivo de ejemplo:

```text
.env.example
```

Ejemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=change_me
DB_NAME=musicBH
JWT_SECRET=change_me
JWT_EXPIRES_IN=2h
MEDIA_ROOT=/media
PUBLIC_URL=http://localhost:3000
```

### No copiar `node_modules` a Docker

Docker debe instalar sus propias dependencias.

Por eso `.dockerignore` debe incluir:

```text
node_modules
```

### Mantener un solo gestor de paquetes

No mezclar:

```text
npm install
pnpm install
yarn install
```

En este proyecto se debe usar:

```bash
pnpm install
```

### Reconstruir cuando cambia Dockerfile o dependencias

Si cambias:

- `Dockerfile`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `docker-compose.yml`

Reconstruye:

```bash
docker compose down
docker compose up -d --build --force-recreate
```

### Separar URL publica y host de base de datos

No son lo mismo:

```env
PUBLIC_URL=http://rasb-brandon.local:3000
DB_HOST=host.docker.internal
```

`PUBLIC_URL` es para que usuarios, navegador o Postman entren a la API.

`DB_HOST` es para que la API encuentre MySQL.

En Docker, esos valores pueden ser diferentes.

---

## Resumen

La migracion de `npm` a `pnpm` mejora la instalacion de dependencias y hace el proyecto mas ordenado, pero requiere adaptar Docker.

En este proyecto, los puntos clave fueron:

- usar `pnpm-lock.yaml` en lugar de `package-lock.json`
- cambiar el `Dockerfile` para usar `corepack pnpm`
- copiar `pnpm-workspace.yaml` antes de instalar dependencias
- aprobar el build de `bcrypt` con `allowBuilds`
- usar `host.docker.internal` para conectar desde Docker a MySQL del host
- reconstruir el contenedor despues de cambiar configuraciones

Con estos cambios, la API puede instalar dependencias correctamente y funcionar dentro de un contenedor Docker.
