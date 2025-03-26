# Step 1: Build the Ionic Vue app in production mode
FROM node:18-alpine AS build

# Install OpenSSL dependencies
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app for production
RUN npm run build

# Step 2: Create a new stage for the application
FROM node:18-alpine AS app

# Install OpenSSL dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Generate Prisma Client in the final stage
RUN npx prisma generate

# Expose port 3000 for the API
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# Step 3: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the built app to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
