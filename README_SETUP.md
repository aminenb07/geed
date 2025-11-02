# GEED Application - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/aminenb07/geed.git
cd geed
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd geed-app/backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```
The backend will run on `http://localhost:5001`

### 3. Frontend Setup (Open a new terminal)
```bash
# Navigate to frontend directory (from the root geed directory)
cd geed-app/frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```
The frontend will run on `http://localhost:3000` (or next available port)

### 4. Access the Application
- **Frontend**: Open your browser and go to `http://localhost:3000`
- **Backend API**: Available at `http://localhost:5001/api`

### 🔐 Test Credentials
- **Admin**: admin@geed.com / admin123
- **User**: user@geed.com / user123

### 📋 Available Features
- ✅ User Authentication (Login/Register)
- ✅ Service Catalog with Search & Filtering
- ✅ Contact Form
- ✅ Admin Dashboard
- ✅ User Profile Management
- ✅ Responsive Design

### 🛠 API Endpoints
- `GET /api/services` - Get all services
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contacts (admin only)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users` - Get users (admin only)

### 🔧 Development Commands

#### Backend
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

#### Frontend
```bash
npm run dev     # Start development server with Vite
npm run build   # Build for production
npm run preview # Preview production build
```

### 📁 Project Structure
```
geed/
├── geed-app/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── store/
│       │   └── App.jsx
│       └── package.json
└── README_SETUP.md
```

### 🚨 Troubleshooting

#### Port Already in Use
If you get a "port already in use" error:
- Backend: The server will automatically try the next available port
- Frontend: Vite will automatically try ports 3000, 3001, 3002, etc.

#### Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues
The backend is configured to accept requests from `http://localhost:3000` and `http://localhost:3001`. If your frontend runs on a different port, update the CORS configuration in `backend/src/server.js`.

### 🌐 Production Deployment

#### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=your-mongodb-connection-string
```

**Frontend (.env)**
```
VITE_API_URL=https://your-backend-domain.com/api
```

#### Build for Production
```bash
# Backend
cd geed-app/backend
npm start

# Frontend
cd geed-app/frontend
npm run build
npm run preview
```

### 📞 Support
If you encounter any issues, please check:
1. Node.js version (should be 16+)
2. All dependencies are installed
3. Both servers are running
4. No port conflicts

For additional help, create an issue in the GitHub repository.

---
**Last Updated**: November 2, 2025
**Version**: 1.0.0