# TaskFlow - Full-Stack Task Manager

A complete, production-structured full-stack Task Management web application built with:
* **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
* **Backend**: Node.js, Express (ES Modules)
* **Database**: MySQL with `mysql2` connection pooling
* **API Style**: RESTful API (JSON)

---

## 📁 Project Structure

```
task_manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MySQL connection pool (mysql2/promise)
│   │   ├── controllers/
│   │   │   └── taskController.js # CRUD business logic & parameterized SQL queries
│   │   ├── routes/
│   │   │   └── taskRoutes.js    # Express REST API routes
│   │   └── server.js            # Express app, middleware, & server boot
│   ├── .env                     # Local environment variables (DB credentials)
│   ├── .env.example             # Template for environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with live task statistics
│   │   │   ├── TaskForm.jsx     # Form to create and edit tasks
│   │   │   ├── TaskItem.jsx     # Individual task card with status toggle, edit, & delete
│   │   │   └── TaskList.jsx     # Task list with search bar & filter tabs (All / Pending / Done)
│   │   ├── services/
│   │   │   └── api.js           # Centralized API service using native fetch
│   │   ├── App.jsx              # Main dashboard component & state coordination
│   │   ├── index.css            # Tailwind CSS styling
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js          # Vite config with React plugin & backend API proxy
│   └── package.json
├── database/
│   └── schema.sql               # Database initialization & table schema
└── README.md
```

---

## 🗄️ Database Setup

If you haven't already created the table, run the following SQL script in your MySQL client (MySQL Workbench, phpMyAdmin, or command-line):

```sql
CREATE DATABASE IF NOT EXISTS task_manager_db;
USE task_manager_db;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  due_date DATETIME NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
 
---

## ⚙️ Configuration (`backend/.env`)

Open `backend/.env` and update your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=task_manager_db
DB_PORT=3306
```

---

## 🚀 Running the Application

Open two terminal windows:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
* The backend will run on **`http://localhost:5000`**.
* It automatically tests the MySQL connection upon startup and logs incoming requests.

### Terminal 2: Frontend Client
```bash
cd frontend
npm run dev
```
* The frontend will run on **`http://localhost:5173`**.
* Vite automatically proxies all `/api/*` calls directly to your backend on port `5000`.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Request Body | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks | None | `200 OK` |
| `GET` | `/api/tasks/:id` | Fetch task by ID | None | `200 OK` / `404` |
| `POST` | `/api/tasks` | Create a task | `{"title": "...", "description": "...", "due_date": "2026-10-15T10:00:00Z"}` | `201 Created` / `400` |
| `PUT` | `/api/tasks/:id` | Update a task | `{"title": "...", "description": "...", "due_date": "...", "is_completed": false}` | `200 OK` / `404` |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle completion | None | `200 OK` / `404` |
| `DELETE`| `/api/tasks/:id` | Delete a task | None | `200 OK` / `404` |
| `GET` | `/api/health` | Health check | None | `200 OK` |

---

## 💡 Key Full-Stack Concepts Demonstrated

1. **Connection Pooling (`mysql2/promise`)**: Reuses open database sockets rather than opening a new socket for every single query, providing high performance.
2. **SQL Injection Defense**: All SQL statements use parameterized queries (`?`) to prevent user input from executing as SQL commands.
3. **API Proxying in Vite**: Instead of dealing with cross-domain issues during development, Vite proxies requests from the React frontend (`5173`) to the Express backend (`5000`).
4. **Declarative React State Management**: Single-source-of-truth state handling in React (`tasks`, `editingTask`, `filter`, `searchQuery`) syncing dynamically with the database.
