# Payments & Accounts Management System

## Overview
A comprehensive web-based system for managing payment transactions and account information. Built with React + Redux for the frontend and Node.js + Express + PostgreSQL for the backend.

## Features

### Frontend (React + Redux)
- **Modern UI**: Clean, responsive design with sidebar navigation
- **Reusable Table Component**: Dynamic columns, pagination, search, and row actions
- **Dashboard**: Summary statistics, recent activity, and key metrics
- **Payments Management**: Full CRUD operations with filtering and search
- **Accounts Management**: Account listing with balance tracking
- **Redux Integration**: Centralized state management
- **TypeScript**: Type-safe development

### Backend (Node.js + Express)
- **RESTful API**: Well-structured endpoints for all operations
- **PostgreSQL Database**: Reliable data storage with proper relationships
- **JWT Authentication**: Secure route protection
- **Input Validation**: Joi-based request validation
- **Error Handling**: Comprehensive error management
- **Swagger Documentation**: Auto-generated API docs
- **Transaction Support**: Database transactions for data integrity

## Project Structure
```
payment-system/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   └── utils/          # API utilities
│   └── package.json
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database & app configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL database
- Git

## Quick Start

### 1. Clone & Setup
```bash
git clone <repository-url>
cd payment-system
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your database settings
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=payments_system
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your-super-secret-jwt-key

# Build and start the server
npm run build
npm start

# For development with auto-reload
npm run dev 
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Database Setup
The backend will automatically create the required tables on startup:
- `accounts` - Account information and balances
- `payments` - Payment transactions
- `users` - User authentication (for future use)

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs

## API Endpoints

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard statistics

### Accounts
- `GET /api/accounts` - List accounts with pagination
- `GET /api/accounts/:id` - Get specific account
- `GET /api/accounts/:id/summary` - Get account summary
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Payments
- `GET /api/payments` - List payments with pagination and filtering
- `GET /api/payments/:id` - Get specific payment
- `GET /api/payments/recent` - Get recent payments
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Key Features Implemented

### Backend Features
- Complete REST API with CRUD operations
- PostgreSQL database with proper schema
- JWT authentication middleware (mock token for demo)
- Request validation using Joi
- Error handling and logging
- Database transactions for data integrity
- Swagger API documentation
- Pagination support for all list endpoints

### Frontend Features
- Reusable Table component with:
  - Dynamic columns
  - Pagination controls
  - Search functionality
  - Row actions (edit/delete)
- Redux state management
- Dashboard with summary statistics
- Real-time data fetching
- Error handling and loading states
- Responsive design

### Database Schema
- **Accounts Table**: Stores account information and current balance
- **Payments Table**: Records all payment transactions
- **Automatic Balance Updates**: Balance calculated from payment transactions
- **Foreign Key Constraints**: Maintains data integrity

## Development

### Backend Development
```bash
cd backend

# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run tests (when implemented)
npm test
```

### Frontend Development
```bash
cd frontend

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Authentication

The system is designed with JWT authentication in mind. Currently uses a mock token for demonstration purposes. In production, you would:

1. Implement user registration/login endpoints
2. Generate real JWT tokens
3. Add user management functionality
4. Implement role-based access control

## Production Deployment

### Database Setup
1. Create PostgreSQL database
2. Set environment variables
3. Tables will be created automatically on first run

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with process manager: `pm2 start dist/index.js`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files through web server (Nginx, Apache)
3. Configure API proxy if needed

## Environment Variables

### Backend (.env)
```env
PORT=8080
NODE_ENV=production

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=payments_system
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=8h

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
## License
MIT License - see LICENSE file for details

## Support
For support or questions, please create an issue in the repository.

---

**Note**: This is a demonstration application. For production use, implement proper authentication, add comprehensive tests, and follow security best practices.

