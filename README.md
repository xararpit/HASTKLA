# HASTKLA

A modern, full-stack web application featuring a React-based frontend and a robust Node.js/Express backend. This project incorporates secure user authentication, database management via Mongoose, and seamless payment processing integration with Razorpay.

## Features

- **Frontend:** Built with React 19 and Vite for lightning-fast development. Includes React Router for navigation and Axios for data fetching.
- **Backend:** Powered by Node.js and Express. Structured API to handle client requests securely.
- **Database:** MongoDB integration using Mongoose for object data modeling.
- **Authentication:** JWT-based secure authentication mechanism, with password hashing via bcryptjs.
- **Payments:** Razorpay integration for handling transactions securely.
- **File Management:** Multer setup for managing file uploads efficiently.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd hastkla
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application Locally

1. **Start the Backend Server:**
   Ensure your `.env` file is properly configured in the `backend/` directory with your MongoDB URI, JWT secret, and Razorpay keys.
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

## Project Structure

- `frontend/`: Contains the React/Vite application.
- `backend/`: Contains the server setup, API routes, models, and controllers.

## License
[ISC](https://opensource.org/licenses/ISC)
