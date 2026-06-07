# Employee Project Management Portal

A full-stack web application built using **React**, **TypeScript**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

This application allows organizations to manage employees, projects, and employee-project assignments efficiently.

-------------------------------------------------------------------------------------------

## GitHub Repository

**Repository:**
https://github.com/Ketan-Gaikwad/employee-project-portal

-------------------------------------------------------------------------------------------

# Features

## Authentication

* Login
* Logout
* JWT Authentication
* Protected API Routes

## Dashboard

* Total Employees
* Total Projects
* Active Projects

## Employee Management

* Add Employee
* Edit Employee
* Delete Employee
* View Employee List
* Search Employees
* Upload Employee Profile Image

## Project Management

* Add Project
* Edit Project
* Delete Project
* View Project List
* Search Projects
* View Employees Assigned to a Project

## Employee Project Assignment

* Assign Employees to Projects
* Remove Employee Assignments
* View Projects Assigned to an Employee
* View Employees Assigned to a Project
* Prevent Duplicate Assignments

## Responsive Design

* Desktop Friendly
* Tablet Friendly
* Mobile Friendly Navigation
* Responsive Tables and Forms

-------------------------------------------------------------------------------------------

# Tech Stack

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* Axios
* React Router DOM
* React Hot Toast

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (Image Upload)

## Database

* PostgreSQL
* Prisma ORM

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Ketan-Gaikwad/employee-project-portal.git
cd employee-project-portal
```

-------------------------------------------------------------------------------------------

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_secret_key"
```

Run Prisma Migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start Backend Server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

-------------------------------------------------------------------------------------------

# Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/employee_portal"
JWT_SECRET="employee_portal_secret"
```

-------------------------------------------------------------------------------------------

# Architecture Overview

The application follows a client-server architecture.

```text
React Frontend
      │
      │ API Requests (Axios)
      ▼
Express.js Backend
      │
      │ Prisma ORM
      ▼
PostgreSQL Database
```

## Frontend

* React + TypeScript
* Tailwind CSS for UI
* Axios for API communication
* React Router for navigation

## Backend

* Express.js REST APIs
* JWT Authentication Middleware
* Prisma ORM for database operations
* Multer for image uploads

## Database

* PostgreSQL Database
* Managed through Prisma schema and migrations

-------------------------------------------------------------------------------------------

# Database Schema

## User

| Field    | Type   |
| -------- | ------ |
| id       | Int    |
| email    | String |
| password | String |

## Employee

| Field        | Type   |
| ------------ | ------ |
| id           | Int    |
| fullName     | String |
| email        | String |
| phone        | String |
| designation  | String |
| department   | String |
| joiningDate  | Date   |
| profileImage | String |

## Project

| Field       | Type   |
| ----------- | ------ |
| id          | Int    |
| projectName | String |
| description | String |
| startDate   | Date   |
| endDate     | Date   |
| status      | String |

## EmployeeProject

| Field      | Type |
| ---------- | ---- |
| id         | Int  |
| employeeId | Int  |
| projectId  | Int  |

This table manages the many-to-many relationship between Employees and Projects.

-------------------------------------------------------------------------------------------

# Project Structure

```text
employee-project-portal/
│
├── backend/
│   ├── middleware/
│   ├── prisma/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

-------------------------------------------------------------------------------------------

# API Endpoints

## Authentication

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | `/auth/register` |
| POST   | `/auth/login`    |

## Employees

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/employees`     |
| POST   | `/employees`     |
| PUT    | `/employees/:id` |
| DELETE | `/employees/:id` |

## Projects

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/projects`     |
| POST   | `/projects`     |
| PUT    | `/projects/:id` |
| DELETE | `/projects/:id` |

## Assignments

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/assign`                 |
| DELETE | `/assign/:id`             |
| GET    | `/employees/:id/projects` |
| GET    | `/projects/:id/employees` |

## Upload

| Method | Endpoint  |
| ------ | --------- |
| POST   | `/upload` |

-------------------------------------------------------------------------------------------

# Deployment

## Frontend URL

https://employee-project-portal.vercel.app/

## Backend URL

https://employee-project-backend-ssq0.onrender.com

## Demo Credentials

Use the following credentials to access the application:

Email: admin@portal.com

Password: Admin@2026Portal

These credentials have full access to test all application features including:

## Note

The backend is deployed on Render free tier. After inactivity, the first request may take a few seconds to wake up.

Dashboard
Employee Management
Project Management
Assignments Management
Employee Profile Image Upload

-------------------------------------------------------------------------------------------

# Walkthrough Video

To be added after recording.

-------------------------------------------------------------------------------------------

# Author

Ketan Gaikwad

Full-Stack Developer Assignment Submission
