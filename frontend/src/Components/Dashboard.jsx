// import { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Dashboard() {
//   const [editId, setEditId] = useState(null);
//   const userId = localStorage.getItem("userId");
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     axios.get(`http://localhost:8081/tasks/${userId}`)
//       .then(res => setTasks(res.data));
//   }, []);

// // const addTask = () => {
// //   axios.post("http://localhost:8081/tasks", { userId, title, description })
// //     .then(res => {
// //       axios.get(`http://localhost:8081/tasks/${userId}`)
// //         .then(res => setTasks(res.data));   // refresh tasks properly
// //     });
// // };

// const addOrUpdateTask = () => {

//   setTitle("");
//   setDescription("");

//   if (editId) {
//     axios.put(`http://localhost:8081/tasks/${editId}`, {
//       title,
//       description,
//       status: "pending"
//     }).then(() => {
//       setEditId(null);
//       axios.get(`http://localhost:8081/tasks/${userId}`)
//         .then(res => setTasks(res.data));
//     });
//   } else {
//     axios.post("http://localhost:8081/tasks", { userId, title, description })
//       .then(() => {
//         axios.get(`http://localhost:8081/tasks/${userId}`)
//           .then(res => setTasks(res.data));
//       });
//   }
// };


//   const startTimer = (taskId) => {
//     axios.post("http://localhost:8081/start-timer", { taskId });
//   };

//   const stopTimer = (taskId) => {
//   axios.post("http://localhost:8081/stop-timer", { taskId })
//     .then(() => {
//       axios.get(`http://localhost:8081/tasks/${userId}`)
//         .then(res => setTasks(res.data));
//     });
// };

// const deleteTask = (taskId) => {
//   axios.delete(`http://localhost:8081/tasks/${taskId}`)
//     .then(() => {
//       setTasks(prev => prev.filter(t => t.id !== taskId));
//     });
// };

// const markComplete = (taskId) => {
//   axios.put(`http://localhost:8081/tasks/status/${taskId}`, {
//     status: "completed"
//   })
//   .then(() => {
//     setTasks(tasks.map(t =>
//       t.id === taskId ? { ...t, status: "completed" } : t
//     ));
//   });
// };

// const markPending = (taskId) => {
//   axios.put(`http://localhost:8081/tasks/status/${taskId}`, {
//     status: "pending"
//   })
//   .then(() => {
//     setTasks(tasks.map(t =>
//       t.id === taskId ? { ...t, status: "pending" } : t
//     ));
//   });
// };


//   return (
//     <div className="container mt-4">

//       <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
//         <h5 style={{ color: "#6c63ff" }}>⏱️ My Task Tracker</h5>

//         <input 
//   className="form-control mb-2" 
//   placeholder="Task title"
//   value={title}
//   onChange={e => setTitle(e.target.value)} 
// />

// <input 
//   className="form-control mb-2" 
//   placeholder="Description"
//   value={description}
//   onChange={e => setDescription(e.target.value)} 
// />


//         <button className="btn"
//           style={{ backgroundColor: "#c7e3ff", border: "none" }}
//           onClick={addOrUpdateTask}>
//           {editId ? "💾 Save Changes" : "➕ Add Task"}
//         </button>


//       </div>

//       <div className="card shadow-sm p-3" style={{ backgroundColor: "#f3f6ff" }}>
//         <table className="table table-hover">
//           <thead style={{ backgroundColor: "#dfe7ff" }}>
//             <tr>
//               <th>Title</th>
//               <th>Status</th>
//               <th>Total Time (sec)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {tasks.map(t => (
//               <tr key={t.id}>
//                 <td>{t.title}</td>
//                 <td>{t.status}</td>
//                 <td>{t.total_time}</td>
//                <td>
//   <button
//     className="btn btn-sm me-2 btn-outline-primary"
//     onClick={() => startTimer(t.id)}
//   >
//     ▶ Start
//   </button>

//   <button
//     className="btn btn-sm me-2 btn-outline-danger"
//     onClick={() => stopTimer(t.id)}
//   >
//     ⏹ Stop
//   </button>

//   <button
//     className="btn btn-sm me-2 btn-outline-success"
//     onClick={() => markComplete(t.id)}
//   >
//     ✅ Done
//   </button>

//   <button
//     className="btn btn-sm me-2 btn-outline-warning"
//     onClick={() => markPending(t.id)}
//   >
//     🔄 Pending
//   </button>

//   <button
//   className="btn btn-sm me-2 btn-outline-secondary"
//   onClick={() => {
//     setTitle(t.title);
//     setDescription(t.description);
//     setEditId(t.id);   // IMPORTANT
//   }}
// >
//   ✏️ Edit
// </button>


//   <button
//   className="btn btn-sm btn-outline-dark"
//   onClick={() => deleteTask(t.id)}
// >
//   🗑 Delete
// </button>

// </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Dashboard() {
//   const userId = localStorage.getItem("userId");
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [editId, setEditId] = useState(null);

//   // Fetch tasks
//   const fetchTasks = () => {
//     axios.get(`http://localhost:8081/tasks/${userId}`)
//       .then(res => setTasks(res.data));
//   };

//   useEffect(() => { fetchTasks(); }, []);

//   // Add or update task
//   const addOrUpdateTask = () => {
//     if (editId) {
//       axios.put(`http://localhost:8081/tasks/${editId}`, {
//         title,
//         description,
//         status: "pending"
//       }).then(() => {
//         setEditId(null);
//         setTitle("");
//         setDescription("");
//         fetchTasks();
//       });
//     } else {
//       axios.post("http://localhost:8081/tasks", { userId, title, description })
//         .then(() => {
//           setTitle("");
//           setDescription("");
//           fetchTasks();
//         });
//     }
//   };

//   // Delete task
//   const deleteTask = (taskId) => {
//     axios.delete(`http://localhost:8081/tasks/${taskId}`)
//       .then(() => fetchTasks());
//   };

//   // Start/Stop timer
//   const startTimer = (taskId) => axios.post("http://localhost:8081/start-timer", { taskId });
//   const stopTimer = (taskId) => axios.post("http://localhost:8081/stop-timer", { taskId }).then(fetchTasks);

//   // Mark complete/pending
//   const markStatus = (taskId, status) =>
//     axios.put(`http://localhost:8081/tasks/status/${taskId}`, { status }).then(fetchTasks);

//   return (
//     <div className="container mt-4">
//       <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
//         <h5 style={{ color: "#6c63ff" }}>⏱️ My Task Tracker</h5>
//         <input className="form-control mb-2" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
//         <input className="form-control mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
//         <button className="btn" style={{ backgroundColor: "#c7e3ff", border: "none" }} onClick={addOrUpdateTask}>
//           {editId ? "💾 Save Changes" : "➕ Add Task"}
//         </button>
//       </div>

//       <div className="card shadow-sm p-3" style={{ backgroundColor: "#f3f6ff" }}>
//         <table className="table table-hover">
//           <thead style={{ backgroundColor: "#dfe7ff" }}>
//             <tr>
//               <th>Title</th>
//               <th>Status</th>
//               <th>Total Time (sec)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map(t => (
//               <tr key={t.id}>
//                 <td>{t.title}</td>
//                 <td>{t.status}</td>
//                 <td>{t.total_time}</td>
//                 <td>
//                   <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startTimer(t.id)}>▶ Start</button>
//                   <button className="btn btn-sm btn-outline-danger me-2" onClick={() => stopTimer(t.id)}>⏹ Stop</button>
//                   <button className="btn btn-sm btn-outline-success me-2" onClick={() => markStatus(t.id, "completed")}>✅ Done</button>
//                   <button className="btn btn-sm btn-outline-warning me-2" onClick={() => markStatus(t.id, "pending")}>🔄 Pending</button>
//                   <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
//                     setTitle(t.title); setDescription(t.description); setEditId(t.id);
//                   }}>✏️ Edit</button>
//                   <button className="btn btn-sm btn-outline-dark" onClick={() => deleteTask(t.id)}>🗑 Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [analytics, setAnalytics] = useState({
    tasksCompletedToday: 0,
    tasksCompletedWeek: 0,
    hoursTrackedToday: 0,
    hoursTrackedWeek: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [activeTimers, setActiveTimers] = useState({});

  // Convert seconds to readable format (HH:MM:SS)
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0h 0m 0s";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Fetch tasks
  const fetchTasks = () => {
    axios.get(`http://localhost:8081/tasks/${userId}`)
      .then(res => {
        setTasks(res.data);
        // Check timer status for each task
        res.data.forEach(task => {
          checkTimerStatus(task.id);
        });
      })
      .catch(err => console.error("Error fetching tasks:", err));
  };

  // Fetch analytics
  const fetchAnalytics = () => {
    axios.get(`http://localhost:8081/analytics/${userId}`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error("Error fetching analytics:", err));
  };

  // Check if timer is running for a task
  const checkTimerStatus = (taskId) => {
    axios.get(`http://localhost:8081/timer-status/${taskId}`)
      .then(res => {
        setActiveTimers(prev => ({
          ...prev,
          [taskId]: res.data.isRunning
        }));
      })
      .catch(err => console.error("Error checking timer:", err));
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, []);

  // Add or update task
  const addOrUpdateTask = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (editId) {
      axios.put(`http://localhost:8081/tasks/${editId}`, {
        title,
        description,
        status: tasks.find(t => t.id === editId)?.status || "pending"
      })
      .then(() => {
        setEditId(null);
        setTitle("");
        setDescription("");
        fetchTasks();
        fetchAnalytics();
      })
      .catch(err => {
        console.error("Error updating task:", err);
        alert("Failed to update task");
      });
    } else {
      axios.post("http://localhost:8081/tasks", { userId, title, description })
        .then(() => {
          setTitle("");
          setDescription("");
          fetchTasks();
          fetchAnalytics();
        })
        .catch(err => {
          console.error("Error creating task:", err);
          alert("Failed to create task");
        });
    }
  };

  // Delete task
  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete(`http://localhost:8081/tasks/${taskId}`)
        .then(() => {
          fetchTasks();
          fetchAnalytics();
        })
        .catch(err => {
          console.error("Error deleting task:", err);
          alert("Failed to delete task");
        });
    }
  };

  // Start timer
  const startTimer = (taskId) => {
    axios.post("http://localhost:8081/start-timer", { taskId })
      .then(() => {
        setActiveTimers(prev => ({ ...prev, [taskId]: true }));
      })
      .catch(err => {
        console.error("Error starting timer:", err);
        alert(err.response?.data?.error || "Failed to start timer");
      });
  };

  // Stop timer
  const stopTimer = (taskId) => {
    axios.post("http://localhost:8081/stop-timer", { taskId })
      .then(() => {
        setActiveTimers(prev => ({ ...prev, [taskId]: false }));
        fetchTasks();
        fetchAnalytics();
      })
      .catch(err => {
        console.error("Error stopping timer:", err);
        alert(err.response?.data?.error || "Failed to stop timer");
      });
  };

  // Mark complete/pending
  const markStatus = (taskId, status) => {
    axios.put(`http://localhost:8081/tasks/status/${taskId}`, { status })
      .then(() => {
        fetchTasks();
        fetchAnalytics();
      })
      .catch(err => {
        console.error("Error updating status:", err);
        alert("Failed to update task status");
      });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: "#6c63ff" }}>⏱️ My Task Tracker</h3>
        <button 
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Productivity Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#e8f5e9" }}>
            <h6 className="text-muted">Tasks Completed Today</h6>
            <h2 style={{ color: "#4caf50" }}>{analytics.tasksCompletedToday}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#e3f2fd" }}>
            <h6 className="text-muted">Tasks Completed This Week</h6>
            <h2 style={{ color: "#2196f3" }}>{analytics.tasksCompletedWeek}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#fff3e0" }}>
            <h6 className="text-muted">Hours Tracked Today</h6>
            <h2 style={{ color: "#ff9800" }}>{formatTime(analytics.hoursTrackedToday)}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#f3e5f5" }}>
            <h6 className="text-muted">Hours Tracked This Week</h6>
            <h2 style={{ color: "#9c27b0" }}>{formatTime(analytics.hoursTrackedWeek)}</h2>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#fce4ec" }}>
            <h6 className="text-muted">Total Tasks</h6>
            <h3 style={{ color: "#e91e63" }}>{analytics.totalTasks}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#e8f5e9" }}>
            <h6 className="text-muted">Completed</h6>
            <h3 style={{ color: "#4caf50" }}>{analytics.completedTasks}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#fff9c4" }}>
            <h6 className="text-muted">Pending</h6>
            <h3 style={{ color: "#fbc02d" }}>{analytics.pendingTasks}</h3>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
        <h5 style={{ color: "#6c63ff" }}>
          {editId ? "✏️ Edit Task" : "➕ Add New Task"}
        </h5>
        <input 
          className="form-control mb-2" 
          placeholder="Task title *" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <textarea 
          className="form-control mb-2" 
          placeholder="Description (optional)" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          rows="2"
        />
        <div className="d-flex gap-2">
          <button 
            className="btn flex-grow-1" 
            style={{ backgroundColor: "#c7e3ff", border: "none" }} 
            onClick={addOrUpdateTask}
          >
            {editId ? "💾 Save Changes" : "➕ Add Task"}
          </button>
          {editId && (
            <button 
              className="btn btn-secondary" 
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card shadow-sm p-3" style={{ backgroundColor: "#f3f6ff" }}>
        <h5 style={{ color: "#6c63ff" }}>📋 All Tasks</h5>
        {tasks.length === 0 ? (
          <p className="text-muted text-center py-4">No tasks yet. Add your first task above!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead style={{ backgroundColor: "#dfe7ff" }}>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Total Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.title}</strong>
                      {activeTimers[t.id] && (
                        <span className="badge bg-success ms-2">⏱️ Running</span>
                      )}
                    </td>
                    <td>{t.description || "-"}</td>
                    <td>
                      {t.status === "completed" ? (
                        <span className="badge bg-success">✅ Completed</span>
                      ) : (
                        <span className="badge bg-warning text-dark">🔄 Pending</span>
                      )}
                    </td>
                    <td>
                      <strong>{formatTime(t.total_time)}</strong>
                    </td>
                    <td>
                      <div className="btn-group-vertical btn-group-sm" role="group">
                        <div className="btn-group btn-group-sm mb-1" role="group">
                          {!activeTimers[t.id] ? (
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => startTimer(t.id)}
                              title="Start Timer"
                            >
                              ▶ Start
                            </button>
                          ) : (
                            <button 
                              className="btn btn-outline-danger" 
                              onClick={() => stopTimer(t.id)}
                              title="Stop Timer"
                            >
                              ⏹ Stop
                            </button>
                          )}
                          {t.status === "pending" ? (
                            <button 
                              className="btn btn-outline-success" 
                              onClick={() => markStatus(t.id, "completed")}
                              title="Mark as Complete"
                            >
                              ✅ Done
                            </button>
                          ) : (
                            <button 
                              className="btn btn-outline-warning" 
                              onClick={() => markStatus(t.id, "pending")}
                              title="Mark as Pending"
                            >
                              🔄 Pending
                            </button>
                          )}
                        </div>
                        <div className="btn-group btn-group-sm" role="group">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => {
                              setTitle(t.title); 
                              setDescription(t.description || ""); 
                              setEditId(t.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="Edit Task"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-outline-dark" 
                            onClick={() => deleteTask(t.id)}
                            title="Delete Task"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}