// import express from 'express'
// import cors from 'cors'
// import mysql from 'mysql2'

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: 'localhost',
//     port: 3307,
//     user: 'root',
//     password: 'Msi#1999',
//     database: 'crud'
// });

// db.connect((err) => {
//     if(err) {
//         console.error("Failed to connect to database:", err);
//         return;
//     }
//     console.log("Successfully connected to MySQL database 'crud'");
// });


// app.get('/', (req, res) => {
//     const sql = "SELECT * FROM student";
//     db.query(sql, (err, result) => {
//         if(err) {
//             console.log("Database error:", err); 
//             return res.json({Message: "Error inside server", Error: err.message});
//         }
//         console.log("Query successful, rows:", result.length);
//         return res.json(result);
//     })
// });


// app.post('/student', (req, res) => {
//     console.log("Received data:", req.body);
//     const sql = "INSERT INTO student (`Name`, `Email`) VALUES (?, ?)";
//     const values = [req.body.Name, req.body.Email];
//     console.log("Values array:", values);
    
//     db.query(sql, values, (err, result) => {
//         if(err) {
//             console.log("SQL Error:", err);
//             return res.json({Message: "Error inside server", Error: err.message});
//         }
//         return res.json({Message: "Student created successfully", result});
//     })
// });

// app.get('/read/:id', (req, res) => {
//     const sql = "SELECT * FROM student WHERE ID = ?";
//     const id = req.params.id;
//     db.query(sql, [id], (err, result) => {
//         if(err) {
//             console.log("Database error:", err); 
//             return res.json({Message: "Error inside server", Error: err.message});
//         }
//         console.log("Query successful, rows:", result.length);
//         return res.json(result);
//     })
// });

// app.put('/edit/:id', (req, res) => {
//     const sql = "UPDATE student SET Name = ?, Email = ? WHERE ID = ?";
//     const id = req.params.id;
//     db.query(sql, [req.body.Name, req.body.Email, id], (err, result) => {
//         if(err) return res.json({Message: "Error inside server", Error: err.message});
//         return res.json(result);
//     })
// });

// app.delete('/delete/:id', (req, res) => {
//     const sql = "DELETE FROM student WHERE ID = ?";
//     const id = req.params.id; 
//     db.query(sql, [id], (err, result) => {
//         if(err) return res.json({Message: "Error inside server", Error: err.message});
//         return res.json(result);
//     })
// });

// app.listen(8081, ()=>{
//     console.log("Server is running on port 8081");
// });


// import express from 'express';
// import cors from 'cors';
// import mysql from 'mysql2';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const SECRET_KEY = "mysecretkey";

// const db = mysql.createConnection({
//   host: 'localhost',
//   port: 3307,
//   user: 'root',
//   password: 'Msi#1999',
//   database: 'task_tracker'
// });

// db.connect(err => {
//   if (err) console.log(err);
//   else console.log("Connected to task_tracker database");
// });

// // -------- AUTHENTICATION --------

// // Register
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
//   db.query(sql, [email, hashedPassword], (err) => {
//     if (err) return res.json({ error: err.message });
//     res.json({ message: "User registered" });
//   });
// });

// // Login
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [email], async (err, result) => {
//     if (err || result.length === 0)
//       return res.json({ error: "Invalid email" });

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.json({ error: "Wrong password" });

//     const token = jwt.sign({ id: user.id }, SECRET_KEY);
//     res.json({ token, userId: user.id });
//   });
// });

// // -------- TASKS CRUD --------

// // Create Task
// app.post("/tasks", (req, res) => {
//   const { userId, title, description } = req.body;

//   const sql = "INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)";
//   db.query(sql, [userId, title, description], (err) => {
//     if (err) return res.json({ error: err.message });
//     res.json({ message: "Task created" });
//   });
// });

// // Get all tasks for a user
// app.get("/tasks/:userId", (req, res) => {
//   const sql = "SELECT * FROM tasks WHERE user_id = ?";
//   db.query(sql, [req.params.userId], (err, result) => {
//     if (err) return res.json({ error: err.message });
//     res.json(result);
//   });
// });

// // Start Timer
// app.post("/start-timer", (req, res) => {
//   const { taskId } = req.body;

//   const sql = "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())";
//   db.query(sql, [taskId], (err) => {
//     if (err) return res.json({ error: err.message });
//     res.json({ message: "Timer started" });
//   });
// });

// // Stop Timer
// app.post("/stop-timer", (req, res) => {
//   const { taskId } = req.body;

//   const sql = `
//     UPDATE time_logs 
//     SET end_time = NOW(),
//         duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
//     WHERE task_id = ? AND end_time IS NULL
//   `;

//   db.query(sql, [taskId], (err) => {
//     if (err) return res.json({ error: err.message });

//     const updateTask = `
//       UPDATE tasks 
//       SET total_time = total_time + 
//       (SELECT duration FROM time_logs WHERE task_id=? ORDER BY id DESC LIMIT 1)
//       WHERE id=?
//     `;

//     db.query(updateTask, [taskId, taskId]);
//     res.json({ message: "Timer stopped" });
//   });
// });

// app.delete("/tasks/:id", (req, res) => {
//   const sql = "DELETE FROM tasks WHERE id = ?";

//   db.query(sql, [req.params.id], (err) => {
//     if (err) return res.json({ error: err.message });
//     res.json({ message: "Task deleted" });
//   });
// });

// app.put("/tasks/:id", (req, res) => {
//   const { title, description, status } = req.body;

//   const sql = 
//     "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";

//   db.query(
//     sql,
//     [title, description, status, req.params.id],
//     (err) => {
//       if (err) return res.json({ error: err.message });
//       res.json({ message: "Task updated successfully" });
//     }
//   );
// });

// app.put("/tasks/status/:id", (req, res) => {
//   const { status } = req.body; // "completed" or "pending"

//   const sql = "UPDATE tasks SET status = ? WHERE id = ?";

//   db.query(sql, [status, req.params.id], (err) => {
//     if (err) return res.json({ error: err.message });
//     res.json({ message: "Status updated" });
//   });
// });



// app.listen(8081, () => console.log("Server running on 8081"));


// import express from "express";
// import cors from "cors";
// import mysql from "mysql2";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const SECRET_KEY = "mysecretkey";

// // MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   port: 3307,
//   user: "root",
//   password: "Msi#1999",
//   database: "task_tracker",
// });

// db.connect((err) => {
//   if (err) console.log(err);
//   else console.log("Connected to task_tracker database");
// });

// // ---------- AUTH ----------

// // Register
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
//   db.query(sql, [email, hashedPassword], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "User registered successfully" });
//   });
// });

// // Login
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [email], async (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (result.length === 0) return res.status(400).json({ error: "Invalid email" });

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.status(400).json({ error: "Wrong password" });

//     const token = jwt.sign({ id: user.id }, SECRET_KEY);
//     res.json({ token, userId: user.id });
//   });
// });

// // ---------- TASK CRUD ----------

// // Get tasks for a user
// app.get("/tasks/:userId", (req, res) => {
//   const sql = "SELECT * FROM tasks WHERE user_id = ?";
//   db.query(sql, [req.params.userId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(result);
//   });
// });

// // Create task
// app.post("/tasks", (req, res) => {
//   const { userId, title, description } = req.body;
//   const sql = "INSERT INTO tasks (user_id, title, description, status, total_time) VALUES (?, ?, ?, 'pending', 0)";
//   db.query(sql, [userId, title, description], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task created successfully" });
//   });
// });

// // Update task
// app.put("/tasks/:id", (req, res) => {
//   const { title, description, status } = req.body;
//   const sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
//   db.query(sql, [title, description, status, req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task updated successfully" });
//   });
// });

// // Delete task
// app.delete("/tasks/:id", (req, res) => {
//   const sql = "DELETE FROM tasks WHERE id = ?";
//   db.query(sql, [req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task deleted successfully" });
//   });
// });

// // Update task status only
// app.put("/tasks/status/:id", (req, res) => {
//   const { status } = req.body;
//   const sql = "UPDATE tasks SET status = ? WHERE id = ?";
//   db.query(sql, [status, req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task status updated" });
//   });
// });

// // Start timer
// app.post("/start-timer", (req, res) => {
//   const { taskId } = req.body;
//   const sql = "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())";
//   db.query(sql, [taskId], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Timer started" });
//   });
// });

// // Stop timer
// app.post("/stop-timer", (req, res) => {
//   const { taskId } = req.body;
//   const updateTimeLog = `
//     UPDATE time_logs
//     SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
//     WHERE task_id = ? AND end_time IS NULL
//   `;
//   db.query(updateTimeLog, [taskId], (err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     // Update total_time in tasks
//     const updateTaskTime = `
//       UPDATE tasks
//       SET total_time = total_time + (
//         SELECT duration FROM time_logs WHERE task_id = ? ORDER BY id DESC LIMIT 1
//       )
//       WHERE id = ?
//     `;
//     db.query(updateTaskTime, [taskId, taskId], (err2) => {
//       if (err2) return res.status(500).json({ error: err2.message });
//       res.json({ message: "Timer stopped and total time updated" });
//     });
//   });
// });

// app.listen(8081, () => console.log("Server running on port 8081"));

import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "Msi#1999",
  database: "task_tracker",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Connected to task_tracker database");
});

// ---------- AUTH ----------

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(sql, [email, hashedPassword], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(400).json({ error: "Invalid email" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ token, userId: user.id });
  });
});

// ---------- TASK CRUD ----------

// Get tasks for a user
app.get("/tasks/:userId", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Create task
app.post("/tasks", (req, res) => {
  const { userId, title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = "INSERT INTO tasks (user_id, title, description, status, total_time) VALUES (?, ?, ?, 'pending', 0)";
  db.query(sql, [userId, title, description || ""], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task created successfully", taskId: result.insertId });
  });
});

// Update task
app.put("/tasks/:id", (req, res) => {
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
  db.query(sql, [title, description, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task updated successfully" });
  });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  // First delete related time logs
  const deleteTimeLogs = "DELETE FROM time_logs WHERE task_id = ?";
  db.query(deleteTimeLogs, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Then delete the task
    const deleteTask = "DELETE FROM tasks WHERE id = ?";
    db.query(deleteTask, [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task deleted successfully" });
    });
  });
});

// Update task status only
app.put("/tasks/status/:id", (req, res) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = "UPDATE tasks SET status = ? WHERE id = ?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task status updated" });
  });
});

// ---------- TIME TRACKING ----------

// Start timer
app.post("/start-timer", (req, res) => {
  const { taskId } = req.body;
  
  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Check if there's already an active timer for this task
  const checkActive = "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL";
  db.query(checkActive, [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result.length > 0) {
      return res.status(400).json({ error: "Timer already running for this task" });
    }

    const sql = "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())";
    db.query(sql, [taskId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Timer started" });
    });
  });
});

// Stop timer
app.post("/stop-timer", (req, res) => {
  const { taskId } = req.body;
  
  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  const updateTimeLog = `
    UPDATE time_logs
    SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
    WHERE task_id = ? AND end_time IS NULL
  `;
  
  db.query(updateTimeLog, [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No active timer found for this task" });
    }

    // Update total_time in tasks
    const updateTaskTime = `
      UPDATE tasks
      SET total_time = (
        SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE task_id = ?
      )
      WHERE id = ?
    `;
    
    db.query(updateTaskTime, [taskId, taskId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Timer stopped and total time updated" });
    });
  });
});

// Check if task has active timer
app.get("/timer-status/:taskId", (req, res) => {
  const sql = "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL";
  db.query(sql, [req.params.taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ 
      isRunning: result.length > 0,
      startTime: result.length > 0 ? result[0].start_time : null
    });
  });
});

// ---------- ANALYTICS ----------

// Get productivity stats
app.get("/analytics/:userId", (req, res) => {
  const userId = req.params.userId;

  // Tasks completed today
  const tasksCompletedToday = `
    SELECT COUNT(*) as count 
    FROM tasks 
    WHERE user_id = ? 
    AND status = 'completed' 
    AND DATE(updated_at) = CURDATE()
  `;

  // Tasks completed this week
  const tasksCompletedWeek = `
    SELECT COUNT(*) as count 
    FROM tasks 
    WHERE user_id = ? 
    AND status = 'completed' 
    AND YEARWEEK(updated_at, 1) = YEARWEEK(CURDATE(), 1)
  `;

  // Total hours tracked today
  const hoursTrackedToday = `
    SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
    FROM time_logs tl
    INNER JOIN tasks t ON tl.task_id = t.id
    WHERE t.user_id = ?
    AND DATE(tl.start_time) = CURDATE()
  `;

  // Total hours tracked this week
  const hoursTrackedWeek = `
    SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
    FROM time_logs tl
    INNER JOIN tasks t ON tl.task_id = t.id
    WHERE t.user_id = ?
    AND YEARWEEK(tl.start_time, 1) = YEARWEEK(CURDATE(), 1)
  `;

  // Total tasks
  const totalTasks = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
    FROM tasks 
    WHERE user_id = ?
  `;

  const analytics = {};

  db.query(tasksCompletedToday, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    analytics.tasksCompletedToday = result[0].count;

    db.query(tasksCompletedWeek, [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      analytics.tasksCompletedWeek = result[0].count;

      db.query(hoursTrackedToday, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        analytics.hoursTrackedToday = result[0].totalSeconds;

        db.query(hoursTrackedWeek, [userId], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          analytics.hoursTrackedWeek = result[0].totalSeconds;

          db.query(totalTasks, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            analytics.totalTasks = result[0].total;
            analytics.completedTasks = result[0].completed;
            analytics.pendingTasks = result[0].pending;

            res.json(analytics);
          });
        });
      });
    });
  });
});

app.listen(8081, () => console.log("Server running on port 8081"));
