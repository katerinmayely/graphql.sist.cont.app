# Usar una imagen base ligera
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias, incluyendo devDependencies
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Exponer el puerto que usará la app
EXPOSE 4000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]