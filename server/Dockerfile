# Use the Node.js image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose the port your server listens on
EXPOSE 5000

# Command to start the server
CMD ["node", "src/server.js"]
