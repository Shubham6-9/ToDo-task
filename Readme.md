# Advanced Todo Tracking Application

A full-stack task management system featuring secure authentication, real-time task organization, and a premium user interface.

## 1. Project Overview
This application provides users with a central dashboard to manage their daily objectives. It supports categorized task views (Active/Completed), priority-level highlighting, due-date tracking, and task reordering system to prioritize work effectively.

## 2. Tech Stack & Reasoning

### Frontend
- **React (Vite)**: Chosen for high-performance rendering.
- **Tailwind CSS**: Enabled rapid creation of a custom, premium design system without the overhead of heavy UI libraries.
- **React Icons**: Provided a consistent, high-quality icon set for the interface.
- **Axios**: Standardized HTTP client for cleaner API interactions.

### Backend
- **Node.js & Express**: Provides a lightweight and scalable foundation for the API.
- **MongoDB & Mongoose**: Flexible schema-based modeling that handles task data and user relationships efficiently.
- **JWT (JSON Web Tokens)**: Secure authentication that works seamlessly across different frontend environments.
- **Express-Validator**: Ensures data integrity by sanitizing and validating inputs before they reach the database.

## 3. Setup Instructions

### Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### Database Configuration
1. Ensure a MongoDB instance (local or Atlas) is running.
2. Update the `MONGO_URI` in the `.env` file.
3. The application uses `connectDB()` in `src/config/db.js` to establish a connection using Mongoose.

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd ToDo-task
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173` or `5174`.

## 4. Authentication Flow
1. **Register**: User submits credentials; password is encrypted via `bcrypt` in the User model pre-save hook.
2. **Login**: User provides email/password. The server verifies the hash and issues a JWT.
3. **Storage**: The token is stored in the browser's `localStorage` via the `AuthContext`.
4. **Authorization**: Every todo-related request includes the `Bearer <token>` header, which the `protect` middleware verifies to identify the user and prevent unauthorized access.

## 5. API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register`: Create a new account.
- `POST /login`: Authenticate and receive a token.

### Todo Routes (`/api/todos`)
- `GET /`: Retrieve user-specific todos (filtered by status or search).
- `POST /`: Create a new task.
- `GET /:id`: Fetch detailed information for a single task.
- `PUT /:id`: Update task content or status (Toggle Complete).
- `DELETE /:id`: Remove a task and automatically rebalance serial numbers.
- `PUT /reorder`: Swap serial numbers between tasks to move them Up/Down.

## 6. Assumptions & Design Decisions
- **Serial Number System**: We implemented a `serialNumber` field to maintain a custom user order rather than relying solely on creation dates.
- **IDOR Protection**: Every Todo request is checked against the `req.user.id` to ensure users can only modify their own data.
- **Clean Architecture**: Separated logic into Controllers, Models, Routes, and Middleware to ensure the codebase remains maintainable as features expand.
- **Silent Operations**: Following user preference, all non-essential logging (terminal console logs) has been removed for a cleaner production environment.
