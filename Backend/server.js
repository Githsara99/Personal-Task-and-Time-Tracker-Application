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
  
//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
//   db.query(sql, [email, hashedPassword], (err) => {
//     if (err) {
//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(400).json({ error: "Email already exists" });
//       }
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ message: "User registered successfully" });
//   });
// });

// // Login
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

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
//   const sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC";
//   db.query(sql, [req.params.userId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(result);
//   });
// });

// // Create task
// app.post("/tasks", (req, res) => {
//   const { userId, title, description } = req.body;
  
//   if (!title) {
//     return res.status(400).json({ error: "Title is required" });
//   }

//   const sql = "INSERT INTO tasks (user_id, title, description, status, total_time) VALUES (?, ?, ?, 'pending', 0)";
//   db.query(sql, [userId, title, description || ""], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task created successfully", taskId: result.insertId });
//   });
// });

// // Update task
// app.put("/tasks/:id", (req, res) => {
//   const { title, description, status } = req.body;
  
//   if (!title) {
//     return res.status(400).json({ error: "Title is required" });
//   }

//   const sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
//   db.query(sql, [title, description, status, req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task updated successfully" });
//   });
// });

// // Delete task
// app.delete("/tasks/:id", (req, res) => {
//   // First delete related time logs
//   const deleteTimeLogs = "DELETE FROM time_logs WHERE task_id = ?";
//   db.query(deleteTimeLogs, [req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
    
//     // Then delete the task
//     const deleteTask = "DELETE FROM tasks WHERE id = ?";
//     db.query(deleteTask, [req.params.id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: "Task deleted successfully" });
//     });
//   });
// });

// // Update task status only
// app.put("/tasks/status/:id", (req, res) => {
//   const { status } = req.body;
  
//   if (!status || !['pending', 'completed'].includes(status)) {
//     return res.status(400).json({ error: "Invalid status" });
//   }

//   const sql = "UPDATE tasks SET status = ? WHERE id = ?";
//   db.query(sql, [status, req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Task status updated" });
//   });
// });

// // ---------- TIME TRACKING ----------

// // Start timer
// app.post("/start-timer", (req, res) => {
//   const { taskId } = req.body;
  
//   if (!taskId) {
//     return res.status(400).json({ error: "Task ID is required" });
//   }

//   // Check if there's already an active timer for this task
//   const checkActive = "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL";
//   db.query(checkActive, [taskId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
    
//     if (result.length > 0) {
//       return res.status(400).json({ error: "Timer already running for this task" });
//     }

//     const sql = "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())";
//     db.query(sql, [taskId], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: "Timer started" });
//     });
//   });
// });

// // Stop timer
// app.post("/stop-timer", (req, res) => {
//   const { taskId } = req.body;
  
//   if (!taskId) {
//     return res.status(400).json({ error: "Task ID is required" });
//   }

//   const updateTimeLog = `
//     UPDATE time_logs
//     SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
//     WHERE task_id = ? AND end_time IS NULL
//   `;
  
//   db.query(updateTimeLog, [taskId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
    
//     if (result.affectedRows === 0) {
//       return res.status(400).json({ error: "No active timer found for this task" });
//     }

//     // Update total_time in tasks
//     const updateTaskTime = `
//       UPDATE tasks
//       SET total_time = (
//         SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE task_id = ?
//       )
//       WHERE id = ?
//     `;
    
//     db.query(updateTaskTime, [taskId, taskId], (err2) => {
//       if (err2) return res.status(500).json({ error: err2.message });
//       res.json({ message: "Timer stopped and total time updated" });
//     });
//   });
// });

// // Check if task has active timer
// app.get("/timer-status/:taskId", (req, res) => {
//   const sql = "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL";
//   db.query(sql, [req.params.taskId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ 
//       isRunning: result.length > 0,
//       startTime: result.length > 0 ? result[0].start_time : null
//     });
//   });
// });

// // ---------- ANALYTICS ----------

// // Debug endpoint - check time logs for a user
// app.get("/debug/time-logs/:userId", (req, res) => {
//   const sql = `
//     SELECT tl.*, t.title, t.user_id
//     FROM time_logs tl
//     INNER JOIN tasks t ON tl.task_id = t.id
//     WHERE t.user_id = ?
//     ORDER BY tl.start_time DESC
//     LIMIT 20
//   `;
  
//   db.query(sql, [req.params.userId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(result);
//   });
// });

// // Get productivity stats
// app.get("/analytics/:userId", (req, res) => {
//   const userId = req.params.userId;

//   // Tasks completed today
//   const tasksCompletedToday = `
//     SELECT COUNT(*) as count 
//     FROM tasks 
//     WHERE user_id = ? 
//     AND status = 'completed' 
//     AND DATE(updated_at) = CURDATE()
//   `;

//   // Tasks completed this week
//   const tasksCompletedWeek = `
//     SELECT COUNT(*) as count 
//     FROM tasks 
//     WHERE user_id = ? 
//     AND status = 'completed' 
//     AND YEARWEEK(updated_at, 1) = YEARWEEK(CURDATE(), 1)
//   `;

//   // Total hours tracked today
//   const hoursTrackedToday = `
//     SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
//     FROM time_logs tl
//     INNER JOIN tasks t ON tl.task_id = t.id
//     WHERE t.user_id = ?
//     AND DATE(tl.start_time) = CURDATE()
//     AND tl.end_time IS NOT NULL
//   `;

//   // Total hours tracked this week
//   const hoursTrackedWeek = `
//     SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
//     FROM time_logs tl
//     INNER JOIN tasks t ON tl.task_id = t.id
//     WHERE t.user_id = ?
//     AND YEARWEEK(tl.start_time, 1) = YEARWEEK(CURDATE(), 1)
//     AND tl.end_time IS NOT NULL
//   `;

//   // Total tasks
//   const totalTasks = `
//     SELECT 
//       COUNT(*) as total,
//       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
//       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
//     FROM tasks 
//     WHERE user_id = ?
//   `;

//   const analytics = {};

//   db.query(tasksCompletedToday, [userId], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     analytics.tasksCompletedToday = result[0].count;

//     db.query(tasksCompletedWeek, [userId], (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       analytics.tasksCompletedWeek = result[0].count;

//       db.query(hoursTrackedToday, [userId], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         analytics.hoursTrackedToday = result[0].totalSeconds;

//         db.query(hoursTrackedWeek, [userId], (err, result) => {
//           if (err) return res.status(500).json({ error: err.message });
//           analytics.hoursTrackedWeek = result[0].totalSeconds;

//           db.query(totalTasks, [userId], (err, result) => {
//             if (err) return res.status(500).json({ error: err.message });
//             analytics.totalTasks = result[0].total;
//             analytics.completedTasks = result[0].completed;
//             analytics.pendingTasks = result[0].pending;

//             res.json(analytics);
//           });
//         });
//       });
//     });
//   });
// });

// app.listen(8081, () => console.log("Server running on port 8081"));

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

// MySQL connection pool (better than single connection)
const pool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "Msi#1999",
  database: "task_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to task_tracker database");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// ---------- AUTH ----------

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );
    
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- TASK CRUD ----------

// Get tasks for a user
app.get("/tasks/:userId", async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create task
app.post("/tasks", async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (user_id, title, description, status, total_time) VALUES (?, ?, ?, 'pending', 0)",
      [userId, title, description || ""]
    );
    
    res.json({ message: "Task created successfully", taskId: result.insertId });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    await pool.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, req.params.id]
    );
    
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM time_logs WHERE task_id = ?", [req.params.id]);
    await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update task status only
app.put("/tasks/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ message: "Task status updated" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- TIME TRACKING ----------

// Start timer
app.post("/start-timer", async (req, res) => {
  try {
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const [active] = await pool.query(
      "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL",
      [taskId]
    );
    
    if (active.length > 0) {
      return res.status(400).json({ error: "Timer already running for this task" });
    }

    await pool.query(
      "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())",
      [taskId]
    );
    
    console.log(`✅ Timer started for task ${taskId}`);
    res.json({ message: "Timer started" });
  } catch (err) {
    console.error("Start timer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Stop timer
app.post("/stop-timer", async (req, res) => {
  try {
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const [result] = await pool.query(
      `UPDATE time_logs
       SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
       WHERE task_id = ? AND end_time IS NULL`,
      [taskId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No active timer found for this task" });
    }

    console.log(`⏹ Timer stopped for task ${taskId}`);

    await pool.query(
      `UPDATE tasks
       SET total_time = (SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE task_id = ?)
       WHERE id = ?`,
      [taskId, taskId]
    );
    
    console.log(`✅ Total time updated for task ${taskId}`);
    res.json({ message: "Timer stopped and total time updated" });
  } catch (err) {
    console.error("Stop timer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Check if task has active timer
app.get("/timer-status/:taskId", async (req, res) => {
  try {
    const [timers] = await pool.query(
      "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL",
      [req.params.taskId]
    );
    
    res.json({ 
      isRunning: timers.length > 0,
      startTime: timers.length > 0 ? timers[0].start_time : null
    });
  } catch (err) {
    console.error("Timer status error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- ANALYTICS ----------

// Debug endpoint
app.get("/debug/time-logs/:userId", async (req, res) => {
  try {
    const [logs] = await pool.query(
      `SELECT tl.*, t.title, t.user_id
       FROM time_logs tl
       INNER JOIN tasks t ON tl.task_id = t.id
       WHERE t.user_id = ?
       ORDER BY tl.start_time DESC
       LIMIT 20`,
      [req.params.userId]
    );
    res.json(logs);
  } catch (err) {
    console.error("Debug logs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ROBUST Analytics endpoint
app.get("/analytics/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log("\n========================================");
    console.log("📊 ANALYTICS REQUEST");
    console.log("========================================");
    console.log("User ID:", userId);
    console.log("Timestamp:", new Date().toISOString());
    
    const analytics = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      tasksCompletedToday: 0,
      tasksCompletedWeek: 0,
      hoursTrackedToday: 0,
      hoursTrackedWeek: 0
    };
    
    // Query 1: Total tasks count
    try {
      const [result] = await pool.query(
        "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?",
        [userId]
      );
      analytics.totalTasks = result[0].total;
      console.log("✅ Total Tasks:", analytics.totalTasks);
    } catch (err) {
      console.error("❌ Error getting total tasks:", err.message);
    }
    
    // Query 2: Completed tasks
    try {
      const [result] = await pool.query(
        "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'",
        [userId]
      );
      analytics.completedTasks = result[0].count;
      console.log("✅ Completed Tasks:", analytics.completedTasks);
    } catch (err) {
      console.error("❌ Error getting completed tasks:", err.message);
    }
    
    // Query 3: Pending tasks
    try {
      const [result] = await pool.query(
        "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pending'",
        [userId]
      );
      analytics.pendingTasks = result[0].count;
      console.log("✅ Pending Tasks:", analytics.pendingTasks);
    } catch (err) {
      console.error("❌ Error getting pending tasks:", err.message);
    }
    
    // Query 4: Tasks completed today
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) as count 
         FROM tasks 
         WHERE user_id = ? 
         AND status = 'completed' 
         AND DATE(updated_at) = CURDATE()`,
        [userId]
      );
      analytics.tasksCompletedToday = result[0].count;
      console.log("✅ Tasks Completed Today:", analytics.tasksCompletedToday);
    } catch (err) {
      console.error("❌ Error getting tasks completed today:", err.message);
    }
    
    // Query 5: Tasks completed this week
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) as count 
         FROM tasks 
         WHERE user_id = ? 
         AND status = 'completed' 
         AND YEARWEEK(updated_at, 1) = YEARWEEK(CURDATE(), 1)`,
        [userId]
      );
      analytics.tasksCompletedWeek = result[0].count;
      console.log("✅ Tasks Completed This Week:", analytics.tasksCompletedWeek);
    } catch (err) {
      console.error("❌ Error getting tasks completed this week:", err.message);
    }
    
    // Query 6: Hours tracked today
    try {
      const [result] = await pool.query(
        `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
         FROM time_logs tl
         INNER JOIN tasks t ON tl.task_id = t.id
         WHERE t.user_id = ?
         AND DATE(tl.start_time) = CURDATE()
         AND tl.end_time IS NOT NULL`,
        [userId]
      );
      analytics.hoursTrackedToday = result[0].totalSeconds;
      console.log("✅ Hours Tracked Today:", analytics.hoursTrackedToday, "seconds");
    } catch (err) {
      console.error("❌ Error getting hours tracked today:", err.message);
    }
    
    // Query 7: Hours tracked this week
    try {
      const [result] = await pool.query(
        `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
         FROM time_logs tl
         INNER JOIN tasks t ON tl.task_id = t.id
         WHERE t.user_id = ?
         AND YEARWEEK(tl.start_time, 1) = YEARWEEK(CURDATE(), 1)
         AND tl.end_time IS NOT NULL`,
        [userId]
      );
      analytics.hoursTrackedWeek = result[0].totalSeconds;
      console.log("✅ Hours Tracked This Week:", analytics.hoursTrackedWeek, "seconds");
    } catch (err) {
      console.error("❌ Error getting hours tracked this week:", err.message);
    }
    
    console.log("========================================");
    console.log("✅ FINAL ANALYTICS:", JSON.stringify(analytics, null, 2));
    console.log("========================================\n");
    
    res.json(analytics);
    
  } catch (err) {
    console.error("❌❌❌ CRITICAL ERROR in analytics:", err);
    res.status(500).json({ 
      error: "Analytics error: " + err.message,
      details: err.stack
    });
  }
});

app.listen(8081, () => console.log("🚀 Server running on port 8081"));