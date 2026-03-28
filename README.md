# TechKraft Buyer Portal

A full-stack MERN (MongoDB, Express, React, Node.js) application built as a take-home assignment. The portal provides a dashboard for users to browse available properties and add/remove them from their personalized Favourites list.

## Features

- **User Authentication:** Secure Signup and Login functionality.
- **JWT Authorization:** Protected routes ensure users must be logged in to view their dashboard or interact with favourites.
- **Data Privacy & Security:** Users can only view, add, or remove their *own* favourites. Passwords are encrypted using `bcryptjs`.
- **Responsive UI:** Clean, intuitive, and mobile-friendly design using Tailwind CSS.
- **Immediate Feedback:** Real-time success and error toasts for seamless UX.

## Technologies Used

**Frontend:**
- React (Vite)
- React Router DOM
- Tailwind CSS v4
- Axios
- React Toastify

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- Helmet & CORS

## Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally or a MongoDB Atlas URI.

### 1. Clone the project and Setup Backend
```bash
cd techkraft-buyer-portal/backend
npm install
```

Create a `.env` file in the `backend` folder containing the following environment variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/techkraft_buyer_portal
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
# OR
node server.js
```

### 2. Setup Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd techkraft-buyer-portal/frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 3. Usage
- The Node backend will run on `http://localhost:5000`
- The React frontend will run on `http://localhost:5173`
- Open the React frontend in your browser, create an account, log in, and start managing favourites!

## API Endpoints Reference

### Authentication API
- `POST /api/auth/register`: Register a new user (Requires: name, email, password)
- `POST /api/auth/login`: Authenticate existing user (Requires: email, password)

### Favourites API (Requires Bearer Token)
- `GET /api/favourites`: Fetch all favourites for the logged-in user.
- `POST /api/favourites`: Add a new property to favourites.
- `DELETE /api/favourites/:id`: Remove a property from favourites.

## Folder Structure

```
techkraft-buyer-portal/
├── backend/
│   ├── controllers/      # Route controllers (auth, favourites)
│   ├── middleware/       # JWT auth & error handling middlewares
│   ├── models/           # Mongoose schemas (User, Favourite)
│   ├── routes/           # Express API routes
│   ├── .env              # Backend environment variables
│   └── server.js         # Entry point for backend
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Header, PropertyCard)
    │   ├── pages/        # Route pages (Login, Register, Dashboard)
    │   ├── api.js        # Axios instance with auth interceptor
    │   ├── App.jsx       # Main App and Routing
    │   └── index.css     # Global styles & Tailwind import
    ├── vite.config.js    # Vite & Tailwind config
    └── package.json      # Frontend dependencies
```
