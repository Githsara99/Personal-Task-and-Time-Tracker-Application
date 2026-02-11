# Task Tracker - Full Stack Productivity Application

A comprehensive task management and time tracking application built with React, Node.js, Express, and MySQL. Track your tasks, monitor time spent, analyze productivity with interactive charts, and export your data.

---

## 🚀 Getting Started

### 📌 Prerequisites

Ensure you have the following before getting started:

* **Node.js** 
* **MySQL**
* **npm**
* A code editor

---

## 📥 Installation

### 1. Clone or download the repository

```bash
git clone https://github.com/Githsara99/Personal-Task-and-Time-Tracker-Application.git
cd task-tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up Database

```bash
# Start MySQL server
mysql -u root -p

# Run database schema
mysql -u root -p -P 3307 < database/complete_schema.sql
```

## 🛠️ Usage

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
node server.js
```


**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```


## 📱 Features

### Core Features
* ✅ **User Authentication** - Secure login/registration with JWT
* 📝 **Task Management** - Create, edit, delete, and complete tasks
* ⏱️ **Time Tracking** - Start/stop timers for accurate time logging
* 📊 **Analytics Dashboard** - Real-time productivity statistics
* 📁 **Categories & Tags** - Organize tasks with custom categories
* 🎯 **Priority Levels** - Urgent, High, Medium, Low priorities
* 🔍 **Advanced Filtering** - Filter by status, category, priority, and search
* 📈 **Data Visualization** - Three interactive charts showing time distribution
* 📅 **Due Dates** - Set and track task deadlines
* 📥 **CSV Export** - Export all task data with one click

---

## 🗄️ Database Schema

The application uses 4 main tables:

* **users** - User accounts with email and encrypted passwords
* **categories** - Custom task categories with colors
* **tasks** - All task information including priority, tags, due dates
* **time_logs** - Time tracking records with start/end times

**Relationships:**
```
users (1:N) tasks
users (1:N) categories
categories (1:N) tasks
tasks (1:N) time_logs
```

---

## 📡 API Endpoints

### Authentication
* `POST /register` - Register new user
* `POST /login` - Login user

### Tasks
* `GET /tasks/:userId` - Get all tasks (with filters)
* `POST /tasks` - Create new task
* `PUT /tasks/:id` - Update task
* `DELETE /tasks/:id` - Delete task

### Categories
* `GET /categories/:userId` - Get categories
* `POST /categories` - Create category
* `PUT /categories/:id` - Update category
* `DELETE /categories/:id` - Delete category

### Time Tracking
* `POST /start-timer` - Start task timer
* `POST /stop-timer` - Stop task timer
* `GET /timer-status/:taskId` - Check timer status

### Analytics & Export
* `GET /analytics/:userId` - Get productivity stats
* `GET /charts/time-by-category/:userId` - Category chart data
* `GET /charts/time-by-priority/:userId` - Priority chart data
* `GET /charts/daily-time/:userId` - Daily time tracking
* `GET /export/tasks/:userId` - Export to CSV

---

## 📄 Deliverables

* ✅ Fully functional full-stack application
* ✅ Complete source code (Frontend + Backend)
* ✅ Database schema and setup scripts
* ✅ Comprehensive API documentation
* ✅ Environment configuration examples
* ✅ Project documentation (README)

---

## 👩‍💻 Author

**Githsara Senarathne**
* GitHub: https://github.com/Githsara99
* LinkedIn: https://www.linkedin.com/in/githsara-senarathne-bb9634215/
* Email: ishangithsara2@gmail.com

---

## 🙏 Acknowledgments

* **React Community** - For comprehensive documentation
* **MySQL** - For robust database management
* **Stack Overflow Community** - For troubleshooting support

---
