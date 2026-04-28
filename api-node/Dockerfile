# Usa Node.js dentro de una imagen liviana.
FROM node:22-alpine

# Define la carpeta donde trabajará el contenedor.
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias.
COPY package*.json ./

# Instala las librerías del proyecto dentro del contenedor.
RUN npm install

# Copia todo el código de la API al contenedor.
COPY . .

# Indica que la app usa el puerto 3000.
EXPOSE 3000

# Arranca la API cuando el contenedor se ejecuta.
CMD ["npm", "start"]