# Conference App

A modern conference management application built with Vue.js, Ionic, and Node.js. This application provides a platform for managing conference events, sessions, and attendees.

## Features

- Modern UI built with Ionic Vue
- Real-time updates using Socket.IO
- RESTful API backend with Express
- PostgreSQL database with Prisma ORM
- Docker containerization for easy deployment

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL database

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd conference-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup the database

```bash
npx prisma generate
npx prisma migrate dev --name init # Initial migration seeds the database with some data automatically
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/conference_db"
PORT=3000
```

### 5. Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode with Docker

1. Build the Docker image:
```bash
docker build -t conference-app .
```

2. Run the container:
```bash
docker run -p 80:80 -p 3000:3000 conference-app
```

Or use the provided batch script:
```bash
run_docker.bat
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:unit` - Run unit tests
- `npm run lint` - Run ESLint

## Project Structure

- `/src` - Frontend Vue.js application
- `/server` - Backend Express server
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/tests` - Test files

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request