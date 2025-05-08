# Task Manager

A full-stack todo task manager application with a React frontend and NestJS backend.

![Task Manager Screenshot](https://via.placeholder.com/800x400?text=Task+Manager+Screenshot)

## Features

- Create and manage tasks with title and description
- View list of tasks (displays the most recent 5 tasks)
- Mark tasks as complete
- Clean and intuitive user interface
- Docker containerization for easy setup
- Swagger API documentation

## Tech Stack

### Frontend

- React with Vite
- Modern UI components
- Responsive design using Tailwind css

### Backend

- NestJS framework
- PostgreSQL database
- Prisma ORM
- RESTful API endpoints
- Swagger documentation

## Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (for local development)
- [npm](https://www.npmjs.com/) (for frontend)
- [Yarn](https://yarnpkg.com/) (for backend)

### Option 1: Using Docker Compose (Recommended)

The easiest way to get the application up and running is using Docker Compose:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. Create required .env files:

Frontend (.env file in the frontend directory):

```
VITE_API_URL=http://localhost:3000/api
```

Backend (.env file in the backend directory):

```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/todoTaskManager?schema=public"
PORT=3000
```

3. Build and start the containers:

```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api
   - API Documentation: http://localhost:3000/api-documentation

### Option 2: Manual Setup

If you prefer to run the services separately:

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create the .env file with the content:

```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/todoTaskManager?schema=public"
PORT=3000
```

3. Install dependencies:

```bash
yarn install
```

4. Start the development server:

```bash
yarn start:dev
```

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Create the .env file with the content:

```
VITE_API_URL=http://localhost:3000/api
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## API Documentation

The NestJS backend provides Swagger documentation for all API endpoints.

- When running, access Swagger UI at: http://localhost:3000/api-documentation

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
yarn test
```

## Project Structure

```
task-manager/
├── frontend/              # React frontend
│   ├── Dockerfile         # Frontend Docker configuration
│   ├── src/               # React source files
│   └── ...
├── backend/               # NestJS backend
│   ├── Dockerfile         # Backend Docker configuration
│   ├── src/               # NestJS source files
│   └── ...
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # This documentation
```

## Usage

1. Add a new task by filling out the form on the left side with a title and description
2. Click the "Add Task" button to create the task
3. View your tasks on the right side (latest 5 tasks are displayed)
4. Mark tasks as complete by clicking the "Complete" button next to each task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
