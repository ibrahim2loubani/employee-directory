# Employee Directory

A full-stack employee directory application built with NestJS (backend) and Next.js (frontend).

## 🚀 Project Structure

```
employee-directory/
├── backend/          # NestJS API server
├── frontend/         # Next.js React application
└── README.md         # This file
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Git](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ibrahim2loubani/employee-directory.git
cd employee-directory
```

### 2. Backend Setup (NestJS)

Navigate to the backend directory and install dependencies:

```bash
cd backend
pnpm install
```

#### Available Backend Scripts:

```bash
# Development (with hot reload)
pnpm run start:dev

# Production build
pnpm run build

# Start production server
pnpm run start:prod

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:cov

# Run end-to-end tests
pnpm run test:e2e

# Lint code
pnpm run lint

# Format code
pnpm run format
```

**Start the backend server:**
```bash
pnpm run start:dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup (Next.js)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
pnpm install
```

#### Environment Configuration

The frontend requires environment variables to connect to the backend API. Create a `.env.local` file in the frontend directory:

```bash
# Create .env.local file
touch .env.local
```

Add the following content to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Available Frontend Scripts:

```bash
# Development server (with Turbopack)
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm run start

# Lint code
pnpm run lint
```

**Start the frontend server:**
```bash
pnpm run dev
```

The frontend application will be available at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   pnpm run start:dev
   ```

2. **Start the frontend server (in a new terminal):**
   ```bash
   cd frontend
   pnpm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Production Mode

1. **Build and start the backend:**
   ```bash
   cd backend
   pnpm run build
   pnpm run start:prod
   ```

2. **Build and start the frontend:**
   ```bash
   cd frontend
   pnpm run build
   pnpm run start
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run unit tests
pnpm run test

# Run tests with coverage
pnpm run test:cov

# Run end-to-end tests
pnpm run test:e2e

# Run tests in watch mode
pnpm run test:watch
```

### Frontend Testing
```bash
cd frontend

# Run linting
pnpm run lint
```

## 🔧 Technology Stack

### Backend (NestJS)
- **Framework:** NestJS
- **Language:** TypeScript
- **HTTP Client:** Axios
- **Validation:** class-validator, class-transformer
- **Testing:** Jest, Supertest

### Frontend (Next.js)
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **UI Components:** Radix UI, Lucide React
- **Forms:** React Hook Form with Zod validation
- **Animation:** Framer Motion

## 📁 Key Features

- Employee CRUD operations
- Responsive design
- Form validation
- API integration
- TypeScript support
- Modern UI components
- Hot reload development

## 🔗 API Endpoints

The backend provides RESTful API endpoints for employee management:

- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   - Backend: Change port in `backend/src/main.ts`
   - Frontend: Use `pnpm run dev -- -p 3001` to run on different port

2. **Environment variables not loading:**
   - Ensure `.env.local` is in the `frontend` directory
   - Restart the development server after adding environment variables

3. **Dependencies issues:**
   - Delete `node_modules` and `pnpm-lock.yaml`
   - Run `pnpm install` again

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the GitHub repository.
