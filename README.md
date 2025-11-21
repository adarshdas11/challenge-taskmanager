# Task Manager Web App (Frontend Developer Task)

A full-stack Task Manager web application built for the Frontend Developer Task.

## Live Links

- 🔹 Frontend (React + TailwindCSS):  
  https://challenge-taskmanager-1.onrender.com

- 🔹 Backend API (Django + DRF + JWT):  
  https://challenge-taskmanager.onrender.com/api/

- 🔹 GitHub Repo:  
  https://github.com/adarshdas11/challenge-taskmanager

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- JWT-based auth (tokens stored in localStorage)

### Backend
- Django
- Django REST Framework
- SimpleJWT for authentication
- SQLite (can be upgraded to PostgreSQL)
- Deployed on Render with Gunicorn

---

## Features

- User Registration & Login (JWT)
- Protected Dashboard (only after login)
- Task CRUD:
  - Create Task
  - Edit Task
  - Delete Task
  - Change Status (Pending / Completed)
- Responsive UI with modern gradients
- Logout with token removal

---

## API Documentation

**Base URL:**  
`https://challenge-taskmanager.onrender.com/api/`

### Auth

#### POST `/auth/register/`
Register new user.

Request body:
```json
{
  "username": "adarsh",
  "email": "adarsh@gmail.com",
  "password": "adarsh123"
}
