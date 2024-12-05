# Stage 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code and build the app
COPY . ./
RUN npm run build  # Assuming your build output is in the 'dist' directory

# Stage 2: Serve the build files using Nginx
FROM nginx:alpine

# Copy the build files from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80
