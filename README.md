# Evenzo — Discover. Connect. Celebrate.

A full-stack MERN event discovery platform built for Indian universities, communities, and campus organizers.

## Overview

Evenzo offers a polished event discovery experience for:

- Attendees looking for nearby festivals, workshops, tech meetups, and parties
- Organizers publishing events, managing registrations, and tracking engagement

The platform is built with a React + Vite frontend, Tailwind CSS styling, and an Express + MongoDB backend.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, React Router DOM, Axios, Framer Motion, React Icons, React Toastify
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT Auth, bcryptjs, multer, dotenv, cors
- Deployment Ready: Frontend → Vercel, Backend → Render/Railway, Database → MongoDB Atlas

## Project Structure

```
evenzo/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── banners/
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── package.json
├── .gitignore
└── README.md
```

## Features

### User Experience

- Discover nearby Indian events
- Search and filter by category, city, date, free/paid
- View event details and register online
- Create attendee accounts and view registrations

### Organizer Experience

- Signup as an organizer
- Create, edit, and delete events
- Upload event banners with multer
- Monitor registrations and event analytics
- Publish or hide events

### Security & Platform

- JWT authentication
- Role-based access control
- Password hashing with bcrypt
- Protected API routes
- Responsive startup-ready UI

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/register/:eventId`
- `GET /api/register/my-registrations`
- `GET /api/dashboard/stats`

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project called "Evenzo"

2. **Create Database Cluster**
   - Click "Build a Database" → Choose "M0 Cluster" (Free)
   - Select your preferred cloud provider and region
   - Choose cluster name (e.g., "evenzo-cluster")
   - Click "Create Cluster" (takes 5-10 minutes)

3. **Set up Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username: `evenzo_user`
   - Create secure password
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `evenzo_db`

### Backend Setup

1. Open terminal in `server` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` file and add your MongoDB Atlas connection string if you want persistent storage. For demo purposes, the app also falls back to a local MongoDB instance or an in-memory database automatically.
   ```
   MONGODB_URI=mongodb+srv://evenzo_user:your_password@your_cluster.mongodb.net/evenzo_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open terminal in `client` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Full Application

For development with both frontend and backend:

1. Open terminal in root directory
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Start both servers concurrently:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run client
npm run server
```

## Notes

- The backend seeds a default organizer and sample Indian events on first startup.
- Demo organizer login: `organizer@evenzo.com` / `Organizer@123`
- Use `http://localhost:5000` as the API base URL during development.
- The app supports mobile-friendly layouts and modern glassmorphism visuals.

## License

MIT License
