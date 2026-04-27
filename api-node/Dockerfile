# Usa Node.js para ejecutar la API.
FROM node:22-alpine

# Carpeta donde va a trabajar el contenedor.
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias.
COPY package*.json ./

# Instala las dependencias del proyecto.
RUN npm install

# Copia el resto del código al contenedor.
COPY . .

# Indica que la app usa el puerto 3000.
EXPOSE 3000

# Comando que se ejecuta al iniciar el contenedor.
CMD ["npm", "start"]