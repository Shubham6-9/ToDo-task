# TODO Application Backend

A secure, production-ready REST API for a TODO application built with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Token (JWT) with HTTP-only Cookies
- **Security:** bcryptjs (password hashing), Helmet (security headers), CORS, IDOR protection

## Features
- **User Authentication:** Registration and Login with secure password hashing.
- **JWT Authorization:** Protected routes requiring valid tokens.
- **TODO CRUD:** Full Create, Read, Update, and Delete operations for user-specific TODOs.
- **Security:**
  - IDOR protection (Users can only access their own TODOs).
  - Centralized error handling.
  - Environment variable management.
  - Input validation.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token

### TODOs (Protected)
- `GET /api/todos` - Get all TODOs for the authenticated user
- `POST /api/todos` - Create a new TODO
- `GET /api/todos/:id` - Get a single TODO by ID
- `PUT /api/todos/:id` - Update a TODO
- `DELETE /api/todos/:id` - Delete a TODO

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas connection URI

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1h
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Design Decisions
- **Project Structure:** Follows a Controller-Service-Route pattern for scalability and maintainability.
- **Security:** JWTs are used for stateless authentication. IDOR checks are implemented at the controller level to ensure data isolation between users.
- **Error Handling:** A centralized middleware handles all errors, ensuring consistent API responses.
