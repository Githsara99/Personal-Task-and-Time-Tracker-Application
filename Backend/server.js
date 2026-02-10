// import express from "express";
// import cors from "cors";
// import mysql from "mysql2/promise";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const SECRET_KEY = "mysecretkey";

// // MySQL connection pool (better than single connection)
// const pool = mysql.createPool({
//   host: "localhost",
//   port: 3307,
//   user: "root",
//   password: "Msi#1999",
//   database: "task_tracker",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Test connection
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✅ Connected to task_tracker database");
//     connection.release();
//   } catch (err) {
//     console.error("❌ Database connection failed:", err);
//   }
// })();

// // ---------- AUTH ----------

// // Register
// app.post("/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await pool.query(
//       "INSERT INTO users (email, password) VALUES (?, ?)",
//       [email, hashedPassword]
//     );
    
//     res.json({ message: "User registered successfully" });
//   } catch (err) {
//     if (err.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ error: "Email already exists" });
//     }
//     console.error("Register error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    
//     if (users.length === 0) {
//       return res.status(400).json({ error: "Invalid email" });
//     }

//     const user = users[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Wrong password" });
//     }

//     const token = jwt.sign({ id: user.id }, SECRET_KEY);
//     res.json({ token, userId: user.id });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- TASK CRUD ----------

// // Get tasks for a user
// app.get("/tasks/:userId", async (req, res) => {
//   try {
//     const [tasks] = await pool.query(
//       "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
//       [req.params.userId]
//     );
//     res.json(tasks);
//   } catch (err) {
//     console.error("Get tasks error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create task
// app.post("/tasks", async (req, res) => {
//   try {
//     const { userId, title, description } = req.body;
    
//     if (!title) {
//       return res.status(400).json({ error: "Title is required" });
//     }

//     const [result] = await pool.query(
//       "INSERT INTO tasks (user_id, title, description, status, total_time) VALUES (?, ?, ?, 'pending', 0)",
//       [userId, title, description || ""]
//     );
    
//     res.json({ message: "Task created successfully", taskId: result.insertId });
//   } catch (err) {
//     console.error("Create task error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update task
// app.put("/tasks/:id", async (req, res) => {
//   try {
//     const { title, description, status } = req.body;
    
//     if (!title) {
//       return res.status(400).json({ error: "Title is required" });
//     }

//     await pool.query(
//       "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
//       [title, description, status, req.params.id]
//     );
    
//     res.json({ message: "Task updated successfully" });
//   } catch (err) {
//     console.error("Update task error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete task
// app.delete("/tasks/:id", async (req, res) => {
//   try {
//     await pool.query("DELETE FROM time_logs WHERE task_id = ?", [req.params.id]);
//     await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
//     res.json({ message: "Task deleted successfully" });
//   } catch (err) {
//     console.error("Delete task error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update task status only
// app.put("/tasks/status/:id", async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!status || !['pending', 'completed'].includes(status)) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id]);
//     res.json({ message: "Task status updated" });
//   } catch (err) {
//     console.error("Update status error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- TIME TRACKING ----------

// // Start timer
// app.post("/start-timer", async (req, res) => {
//   try {
//     const { taskId } = req.body;
    
//     if (!taskId) {
//       return res.status(400).json({ error: "Task ID is required" });
//     }

//     const [active] = await pool.query(
//       "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL",
//       [taskId]
//     );
    
//     if (active.length > 0) {
//       return res.status(400).json({ error: "Timer already running for this task" });
//     }

//     await pool.query(
//       "INSERT INTO time_logs (task_id, start_time) VALUES (?, NOW())",
//       [taskId]
//     );
    
//     console.log(`✅ Timer started for task ${taskId}`);
//     res.json({ message: "Timer started" });
//   } catch (err) {
//     console.error("Start timer error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Stop timer
// app.post("/stop-timer", async (req, res) => {
//   try {
//     const { taskId } = req.body;
    
//     if (!taskId) {
//       return res.status(400).json({ error: "Task ID is required" });
//     }

//     const [result] = await pool.query(
//       `UPDATE time_logs
//        SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW())
//        WHERE task_id = ? AND end_time IS NULL`,
//       [taskId]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(400).json({ error: "No active timer found for this task" });
//     }

//     console.log(`⏹ Timer stopped for task ${taskId}`);

//     await pool.query(
//       `UPDATE tasks
//        SET total_time = (SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE task_id = ?)
//        WHERE id = ?`,
//       [taskId, taskId]
//     );
    
//     console.log(`✅ Total time updated for task ${taskId}`);
//     res.json({ message: "Timer stopped and total time updated" });
//   } catch (err) {
//     console.error("Stop timer error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Check if task has active timer
// app.get("/timer-status/:taskId", async (req, res) => {
//   try {
//     const [timers] = await pool.query(
//       "SELECT * FROM time_logs WHERE task_id = ? AND end_time IS NULL",
//       [req.params.taskId]
//     );
    
//     res.json({ 
//       isRunning: timers.length > 0,
//       startTime: timers.length > 0 ? timers[0].start_time : null
//     });
//   } catch (err) {
//     console.error("Timer status error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- ANALYTICS ----------

// // Debug endpoint
// app.get("/debug/time-logs/:userId", async (req, res) => {
//   try {
//     const [logs] = await pool.query(
//       `SELECT tl.*, t.title, t.user_id
//        FROM time_logs tl
//        INNER JOIN tasks t ON tl.task_id = t.id
//        WHERE t.user_id = ?
//        ORDER BY tl.start_time DESC
//        LIMIT 20`,
//       [req.params.userId]
//     );
//     res.json(logs);
//   } catch (err) {
//     console.error("Debug logs error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ROBUST Analytics endpoint
// app.get("/analytics/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
    
//     console.log("\n========================================");
//     console.log("📊 ANALYTICS REQUEST");
//     console.log("========================================");
//     console.log("User ID:", userId);
//     console.log("Timestamp:", new Date().toISOString());
    
//     const analytics = {
//       totalTasks: 0,
//       completedTasks: 0,
//       pendingTasks: 0,
//       tasksCompletedToday: 0,
//       tasksCompletedWeek: 0,
//       hoursTrackedToday: 0,
//       hoursTrackedWeek: 0
//     };
    
//     // Query 1: Total tasks count
//     try {
//       const [result] = await pool.query(
//         "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?",
//         [userId]
//       );
//       analytics.totalTasks = result[0].total;
//       console.log("✅ Total Tasks:", analytics.totalTasks);
//     } catch (err) {
//       console.error("❌ Error getting total tasks:", err.message);
//     }
    
//     // Query 2: Completed tasks
//     try {
//       const [result] = await pool.query(
//         "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'",
//         [userId]
//       );
//       analytics.completedTasks = result[0].count;
//       console.log("✅ Completed Tasks:", analytics.completedTasks);
//     } catch (err) {
//       console.error("❌ Error getting completed tasks:", err.message);
//     }
    
//     // Query 3: Pending tasks
//     try {
//       const [result] = await pool.query(
//         "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pending'",
//         [userId]
//       );
//       analytics.pendingTasks = result[0].count;
//       console.log("✅ Pending Tasks:", analytics.pendingTasks);
//     } catch (err) {
//       console.error("❌ Error getting pending tasks:", err.message);
//     }
    
//     // Query 4: Tasks completed today
//     try {
//       const [result] = await pool.query(
//         `SELECT COUNT(*) as count 
//          FROM tasks 
//          WHERE user_id = ? 
//          AND status = 'completed' 
//          AND DATE(updated_at) = CURDATE()`,
//         [userId]
//       );
//       analytics.tasksCompletedToday = result[0].count;
//       console.log("✅ Tasks Completed Today:", analytics.tasksCompletedToday);
//     } catch (err) {
//       console.error("❌ Error getting tasks completed today:", err.message);
//     }
    
//     // Query 5: Tasks completed this week
//     try {
//       const [result] = await pool.query(
//         `SELECT COUNT(*) as count 
//          FROM tasks 
//          WHERE user_id = ? 
//          AND status = 'completed' 
//          AND YEARWEEK(updated_at, 1) = YEARWEEK(CURDATE(), 1)`,
//         [userId]
//       );
//       analytics.tasksCompletedWeek = result[0].count;
//       console.log("✅ Tasks Completed This Week:", analytics.tasksCompletedWeek);
//     } catch (err) {
//       console.error("❌ Error getting tasks completed this week:", err.message);
//     }
    
//     // Query 6: Hours tracked today
//     try {
//       const [result] = await pool.query(
//         `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
//          FROM time_logs tl
//          INNER JOIN tasks t ON tl.task_id = t.id
//          WHERE t.user_id = ?
//          AND DATE(tl.start_time) = CURDATE()
//          AND tl.end_time IS NOT NULL`,
//         [userId]
//       );
//       analytics.hoursTrackedToday = result[0].totalSeconds;
//       console.log("✅ Hours Tracked Today:", analytics.hoursTrackedToday, "seconds");
//     } catch (err) {
//       console.error("❌ Error getting hours tracked today:", err.message);
//     }
    
//     // Query 7: Hours tracked this week
//     try {
//       const [result] = await pool.query(
//         `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds
//          FROM time_logs tl
//          INNER JOIN tasks t ON tl.task_id = t.id
//          WHERE t.user_id = ?
//          AND YEARWEEK(tl.start_time, 1) = YEARWEEK(CURDATE(), 1)
//          AND tl.end_time IS NOT NULL`,
//         [userId]
//       );
//       analytics.hoursTrackedWeek = result[0].totalSeconds;
//       console.log("✅ Hours Tracked This Week:", analytics.hoursTrackedWeek, "seconds");
//     } catch (err) {
//       console.error("❌ Error getting hours tracked this week:", err.message);
//     }
    
//     console.log("========================================");
//     console.log("✅ FINAL ANALYTICS:", JSON.stringify(analytics, null, 2));
//     console.log("========================================\n");
    
//     res.json(analytics);
    
//   } catch (err) {
//     console.error("❌❌❌ CRITICAL ERROR in analytics:", err);
//     res.status(500).json({ 
//       error: "Analytics error: " + err.message,
//       details: err.stack
//     });
//   }
// });

// app.listen(8081, () => console.log("🚀 Server running on port 8081"));

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

// MySQL connection pool
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
    
    // Create default categories for new user
    const userId = result.insertId;
    await pool.query(
      `INSERT INTO categories (user_id, name, color) VALUES 
       (?, 'Work', '#2196f3'),
       (?, 'Personal', '#4caf50'),
       (?, 'Urgent', '#f44336')`,
      [userId, userId, userId]
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

// ---------- CATEGORIES ----------

// Get categories for user
app.get("/categories/:userId", async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM categories WHERE user_id = ? ORDER BY name",
      [req.params.userId]
    );
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create category
app.post("/categories", async (req, res) => {
  try {
    const { userId, name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)",
      [userId, name, color || '#6c63ff']
    );
    
    res.json({ message: "Category created successfully", categoryId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Category name already exists" });
    }
    console.error("Create category error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update category
app.put("/categories/:id", async (req, res) => {
  try {
    const { name, color } = req.body;
    
    await pool.query(
      "UPDATE categories SET name = ?, color = ? WHERE id = ?",
      [name, color, req.params.id]
    );
    
    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete category
app.delete("/categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- TASK CRUD (ENHANCED) ----------

// Get tasks with filters and sorting
app.get("/tasks/:userId", async (req, res) => {
  try {
    const { 
      status, 
      category, 
      priority, 
      search, 
      sortBy = 'created_at', 
      sortOrder = 'DESC' 
    } = req.query;
    
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [req.params.userId];
    
    // Apply filters
    if (status && status !== 'all') {
      query += " AND t.status = ?";
      params.push(status);
    }
    
    if (category && category !== 'all') {
      query += " AND t.category_id = ?";
      params.push(category);
    }
    
    if (priority && priority !== 'all') {
      query += " AND t.priority = ?";
      params.push(priority);
    }
    
    if (search) {
      query += " AND (t.title LIKE ? OR t.description LIKE ? OR t.tags LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Apply sorting
    const validSortColumns = ['created_at', 'updated_at', 'title', 'priority', 'due_date', 'total_time', 'status'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY t.${sortBy} ${sortOrder}`;
    } else {
      query += " ORDER BY t.created_at DESC";
    }
    
    const [tasks] = await pool.query(query, params);
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create task (enhanced)
app.post("/tasks", async (req, res) => {
  try {
    const { userId, title, description, category_id, priority, tags, due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, category_id, priority, tags, due_date, status, total_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0)`,
      [userId, title, description || "", category_id || null, priority || 'medium', tags || "", due_date || null]
    );
    
    res.json({ message: "Task created successfully", taskId: result.insertId });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update task (enhanced)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, status, category_id, priority, tags, due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    await pool.query(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, category_id = ?, priority = ?, tags = ?, due_date = ?
       WHERE id = ?`,
      [title, description, status, category_id || null, priority, tags || "", due_date || null, req.params.id]
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

// Export tasks as CSV
app.get("/export/tasks/:userId", async (req, res) => {
  try {
    const [tasks] = await pool.query(
      `SELECT 
         t.id, t.title, t.description, t.status, 
         COALESCE(t.priority, 'medium') as priority, 
         COALESCE(t.tags, '') as tags,
         COALESCE(c.name, 'Uncategorized') as category, 
         t.total_time, 
         t.due_date,
         t.created_at
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ?
       ORDER BY t.id DESC`,
      [req.params.userId]
    );
    
    // Create CSV
    let csv = 'ID,Title,Description,Status,Priority,Category,Tags,Total Time (seconds),Due Date,Created At\n';
    
    tasks.forEach(task => {
      csv += `${task.id},"${(task.title || '').replace(/"/g, '""')}","${(task.description || '').replace(/"/g, '""')}",${task.status},${task.priority},"${(task.category || '').replace(/"/g, '""')}","${(task.tags || '').replace(/"/g, '""')}",${task.total_time},"${task.due_date || ''}","${task.created_at}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks_export.csv');
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- TIME TRACKING ----------

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

    await pool.query(
      `UPDATE tasks
       SET total_time = (SELECT COALESCE(SUM(duration), 0) FROM time_logs WHERE task_id = ?)
       WHERE id = ?`,
      [taskId, taskId]
    );
    
    res.json({ message: "Timer stopped and total time updated" });
  } catch (err) {
    console.error("Stop timer error:", err);
    res.status(500).json({ error: err.message });
  }
});

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

// ---------- ANALYTICS & CHARTS ----------

app.get("/analytics/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log("\n📊 Analytics Request for User:", userId);
    
    const analytics = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      tasksCompletedToday: 0,
      tasksCompletedWeek: 0,
      hoursTrackedToday: 0,
      hoursTrackedWeek: 0
    };
    
    // Check if updated_at column exists
    const [columns] = await pool.query("SHOW COLUMNS FROM tasks LIKE 'updated_at'");
    const hasUpdatedAt = columns.length > 0;
    const dateColumn = hasUpdatedAt ? 'updated_at' : 'created_at';
    
    console.log(`Using ${dateColumn} for date comparisons`);
    
    const [totalResult] = await pool.query(
      "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?",
      [userId]
    );
    analytics.totalTasks = totalResult[0].total;
    console.log("Total Tasks:", analytics.totalTasks);
    
    const [completedResult] = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'",
      [userId]
    );
    analytics.completedTasks = completedResult[0].count;
    console.log("Completed Tasks:", analytics.completedTasks);
    
    const [pendingResult] = await pool.query(
      "SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pending'",
      [userId]
    );
    analytics.pendingTasks = pendingResult[0].count;
    console.log("Pending Tasks:", analytics.pendingTasks);
    
    const [todayResult] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM tasks 
       WHERE user_id = ? 
       AND status = 'completed' 
       AND DATE(${dateColumn}) = CURDATE()`,
      [userId]
    );
    analytics.tasksCompletedToday = todayResult[0].count;
    console.log("Tasks Completed Today:", analytics.tasksCompletedToday);
    
    const [weekResult] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM tasks 
       WHERE user_id = ? 
       AND status = 'completed' 
       AND YEARWEEK(${dateColumn}, 1) = YEARWEEK(CURDATE(), 1)`,
      [userId]
    );
    analytics.tasksCompletedWeek = weekResult[0].count;
    console.log("Tasks Completed This Week:", analytics.tasksCompletedWeek);
    
    const [hoursTodayResult] = await pool.query(
      `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds, COUNT(*) as logCount
       FROM time_logs tl
       INNER JOIN tasks t ON tl.task_id = t.id
       WHERE t.user_id = ?
       AND DATE(tl.start_time) = CURDATE()
       AND tl.end_time IS NOT NULL`,
      [userId]
    );
    analytics.hoursTrackedToday = hoursTodayResult[0].totalSeconds;
    console.log("Hours Today:", analytics.hoursTrackedToday, "seconds from", hoursTodayResult[0].logCount, "logs");
    
    const [hoursWeekResult] = await pool.query(
      `SELECT COALESCE(SUM(tl.duration), 0) as totalSeconds, COUNT(*) as logCount
       FROM time_logs tl
       INNER JOIN tasks t ON tl.task_id = t.id
       WHERE t.user_id = ?
       AND YEARWEEK(tl.start_time, 1) = YEARWEEK(CURDATE(), 1)
       AND tl.end_time IS NOT NULL`,
      [userId]
    );
    analytics.hoursTrackedWeek = hoursWeekResult[0].totalSeconds;
    console.log("Hours Week:", analytics.hoursTrackedWeek, "seconds from", hoursWeekResult[0].logCount, "logs");
    
    console.log("✅ Analytics Complete\n");
    res.json(analytics);
    
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Chart data - Time distribution by category
app.get("/charts/time-by-category/:userId", async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT 
         c.name as category,
         c.color,
         SUM(t.total_time) as total_seconds,
         COUNT(t.id) as task_count
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ?
       GROUP BY c.id, c.name, c.color
       ORDER BY total_seconds DESC`,
      [req.params.userId]
    );
    
    res.json(data);
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Chart data - Time distribution by priority
app.get("/charts/time-by-priority/:userId", async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT 
         priority,
         SUM(total_time) as total_seconds,
         COUNT(id) as task_count
       FROM tasks
       WHERE user_id = ?
       GROUP BY priority
       ORDER BY 
         CASE priority
           WHEN 'urgent' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END`,
      [req.params.userId]
    );
    
    res.json(data);
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Chart data - Daily time tracking (last 7 days)
app.get("/charts/daily-time/:userId", async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT 
         DATE(tl.start_time) as date,
         SUM(tl.duration) as total_seconds
       FROM time_logs tl
       INNER JOIN tasks t ON tl.task_id = t.id
       WHERE t.user_id = ?
       AND tl.start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND tl.end_time IS NOT NULL
       GROUP BY DATE(tl.start_time)
       ORDER BY date ASC`,
      [req.params.userId]
    );
    
    res.json(data);
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8081, () => console.log("🚀 Server running on port 8081!"));