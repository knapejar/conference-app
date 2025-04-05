# Step 1: Build the Ionic Vue app in production mode
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full app
COPY . .

# Build the client
RUN npm run build


# Step 2: Final image with Node.js server + Nginx
FROM node:18-alpine

# Install Nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Create app directory
WORKDIR /app

# Copy the full project from the build stage
COPY --from=build /app /app

# Copy built frontend to Nginx html folder
RUN mkdir -p /var/www && cp -r /app/dist/* /var/www/

# Nginx config
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Expose backend and frontend ports
EXPOSE 80
EXPOSE 3000

# Run both Node server and Nginx via supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
