# Step 1: Build the Ionic Vue app in production mode
FROM node:18-alpine AS build

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full app
COPY . .

# Build the client with environment variables
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

# Add database URL for migrations
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Run initial migration if INITIAL_MIGRATION is set to true
ARG INITIAL_MIGRATION
RUN if [ "$INITIAL_MIGRATION" = "true" ] ; then npx prisma migrate dev --name init && npx prisma db seed ; fi

# Step 2: Final image with Node.js server + Nginx
FROM node:18-alpine

# Install Nginx, supervisor and OpenSSL
RUN apk add --no-cache nginx supervisor openssl

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full project from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/server /app/server
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma

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
