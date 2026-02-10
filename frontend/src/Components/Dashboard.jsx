

import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EnhancedDashboard() {
  const userId = localStorage.getItem("userId");
  
  // State
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  
  // Analytics & Charts
  const [analytics, setAnalytics] = useState({});
  const [activeTimers, setActiveTimers] = useState({});
  const [showCharts, setShowCharts] = useState(false);
  const [chartData, setChartData] = useState({
    byCategory: [],
    byPriority: [],
    daily: []
  });
  
  // Category management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6c63ff");

  const formatTime = (seconds) => {
    const totalSeconds = parseInt(seconds) || 0;
    if (totalSeconds === 0) return "0h 0m 0s";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-danger',
      high: 'bg-warning',
      medium: 'bg-info',
      low: 'bg-secondary'
    };
    return badges[priority] || 'bg-secondary';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: '🔥',
      high: '⚡',
      medium: '➡️',
      low: '⬇️'
    };
    return icons[priority] || '➡️';
  };

  // Fetch data
  const fetchTasks = () => {
    const params = new URLSearchParams({
      status: filterStatus,
      category: filterCategory,
      priority: filterPriority,
      search: searchTerm,
      sortBy: sortBy,
      sortOrder: sortOrder
    });
    
    axios.get(`http://localhost:8081/tasks/${userId}?${params}`)
      .then(res => {
        setTasks(res.data);
        res.data.forEach(task => checkTimerStatus(task.id));
      })
      .catch(err => console.error("Error fetching tasks:", err));
  };

  const fetchCategories = () => {
    axios.get(`http://localhost:8081/categories/${userId}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  };

  const fetchAnalytics = () => {
    axios.get(`http://localhost:8081/analytics/${userId}`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error("Error fetching analytics:", err));
  };

  const fetchChartData = () => {
    Promise.all([
      axios.get(`http://localhost:8081/charts/time-by-category/${userId}`),
      axios.get(`http://localhost:8081/charts/time-by-priority/${userId}`),
      axios.get(`http://localhost:8081/charts/daily-time/${userId}`)
    ])
    .then(([categoryRes, priorityRes, dailyRes]) => {
      setChartData({
        byCategory: categoryRes.data,
        byPriority: priorityRes.data,
        daily: dailyRes.data
      });
    })
    .catch(err => console.error("Error fetching chart data:", err));
  };

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
    fetchCategories();
    fetchAnalytics();
  }, [filterStatus, filterCategory, filterPriority, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (showCharts) {
      fetchChartData();
    }
  }, [showCharts]);

  // Add/Update task
  const addOrUpdateTask = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const taskData = {
      userId,
      title,
      description,
      category_id: categoryId || null,
      priority,
      tags,
      due_date: dueDate || null,
      status: editId ? tasks.find(t => t.id === editId)?.status : "pending"
    };

    if (editId) {
      axios.put(`http://localhost:8081/tasks/${editId}`, taskData)
        .then(() => {
          resetForm();
          fetchTasks();
          fetchAnalytics();
        })
        .catch(err => alert("Failed to update task"));
    } else {
      axios.post("http://localhost:8081/tasks", taskData)
        .then(() => {
          resetForm();
          fetchTasks();
          fetchAnalytics();
        })
        .catch(err => alert("Failed to create task"));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setCategoryId("");
    setPriority("medium");
    setTags("");
    setDueDate("");
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete(`http://localhost:8081/tasks/${taskId}`)
        .then(() => {
          fetchTasks();
          fetchAnalytics();
        })
        .catch(err => alert("Failed to delete task"));
    }
  };

  const startTimer = (taskId) => {
    axios.post("http://localhost:8081/start-timer", { taskId })
      .then(() => {
        setActiveTimers(prev => ({ ...prev, [taskId]: true }));
      })
      .catch(err => alert(err.response?.data?.error || "Failed to start timer"));
  };

  const stopTimer = (taskId) => {
    axios.post("http://localhost:8081/stop-timer", { taskId })
      .then(() => {
        setActiveTimers(prev => ({ ...prev, [taskId]: false }));
        fetchTasks();
        fetchAnalytics();
      })
      .catch(err => alert(err.response?.data?.error || "Failed to stop timer"));
  };

  const markStatus = (taskId, status) => {
    axios.put(`http://localhost:8081/tasks/status/${taskId}`, { status })
      .then(() => {
        fetchTasks();
        fetchAnalytics();
      })
      .catch(err => alert("Failed to update task status"));
  };

  // Category management
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    axios.post("http://localhost:8081/categories", {
      userId,
      name: newCategoryName,
      color: newCategoryColor
    })
    .then(() => {
      setNewCategoryName("");
      setNewCategoryColor("#6c63ff");
      setShowCategoryModal(false);
      fetchCategories();
    })
    .catch(err => alert(err.response?.data?.error || "Failed to create category"));
  };

  // Export to CSV
  const exportToCSV = () => {
    window.open(`http://localhost:8081/export/tasks/${userId}`, '_blank');
  };

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-3">
        <div className="col">
          <h3 style={{ color: "#6c63ff" }}>⏱️ Enhanced Task Tracker</h3>
        </div>
        <div className="col text-end">
          <button className="btn btn-sm btn-success me-2" onClick={exportToCSV}>
            📥 Export CSV
          </button>
          <button 
            className="btn btn-sm btn-info me-2"
            onClick={() => setShowCharts(!showCharts)}
          >
            📊 {showCharts ? 'Hide' : 'Show'} Charts
          </button>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#e8f5e9" }}>
            <h6 className="text-muted">Tasks Completed Today</h6>
            <h2 style={{ color: "#4caf50" }}>{analytics.tasksCompletedToday || 0}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#e3f2fd" }}>
            <h6 className="text-muted">Tasks This Week</h6>
            <h2 style={{ color: "#2196f3" }}>{analytics.tasksCompletedWeek || 0}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#fff3e0" }}>
            <h6 className="text-muted">Hours Today</h6>
            <h2 style={{ color: "#ff9800" }}>{formatTime(analytics.hoursTrackedToday)}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center" style={{ backgroundColor: "#f3e5f5" }}>
            <h6 className="text-muted">Hours This Week</h6>
            <h2 style={{ color: "#9c27b0" }}>{formatTime(analytics.hoursTrackedWeek)}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      {showCharts && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>⏰ Time by Category</h6>
              {chartData.byCategory.map(item => (
                <div key={item.category} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>
                      <span style={{ color: item.color }}>●</span> {item.category || 'Uncategorized'}
                    </span>
                    <span>{formatTime(item.total_seconds)}</span>
                  </div>
                  <div className="progress" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(item.total_seconds / chartData.byCategory.reduce((sum, c) => sum + c.total_seconds, 0)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>🎯 Time by Priority</h6>
              {chartData.byPriority.map(item => (
                <div key={item.priority} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{getPriorityIcon(item.priority)} {item.priority}</span>
                    <span>{formatTime(item.total_seconds)}</span>
                  </div>
                  <div className="progress" style={{ height: '5px' }}>
                    <div 
                      className={`progress-bar ${getPriorityBadge(item.priority)}`}
                      style={{ width: `${(item.total_seconds / chartData.byPriority.reduce((sum, p) => sum + p.total_seconds, 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h6>📅 Daily Time (Last 7 Days)</h6>
              {chartData.daily.map(item => (
                <div key={item.date} className="d-flex justify-content-between mb-1">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span>{formatTime(item.total_seconds)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
        <div className="row g-2">
          <div className="col-md-3">
            <input 
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="urgent">🔥 Urgent</option>
              <option value="high">⚡ High</option>
              <option value="medium">➡️ Medium</option>
              <option value="low">⬇️ Low</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select form-select-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="created_at">Created Date</option>
              <option value="updated_at">Updated Date</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
              <option value="total_time">Time Spent</option>
            </select>
          </div>
          <div className="col-md-1">
            <button 
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            >
              {sortOrder === 'ASC' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Task Form */}
      <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 style={{ color: "#6c63ff" }}>{editId ? "✏️ Edit Task" : "➕ Add New Task"}</h5>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowCategoryModal(true)}
          >
            📁 Manage Categories
          </button>
        </div>
        
        <div className="row g-2">
          <div className="col-md-6">
            <input 
              className="form-control form-control-sm" 
              placeholder="Task title *" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">No Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-sm" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">⬇️ Low</option>
              <option value="medium">➡️ Medium</option>
              <option value="high">⚡ High</option>
              <option value="urgent">🔥 Urgent</option>
            </select>
          </div>
          <div className="col-md-8">
            <textarea 
              className="form-control form-control-sm" 
              placeholder="Description" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows="2"
            />
          </div>
          <div className="col-md-4">
            <input 
              type="text"
              className="form-control form-control-sm mb-1" 
              placeholder="Tags (comma-separated)" 
              value={tags} 
              onChange={e => setTags(e.target.value)}
            />
            <input 
              type="date"
              className="form-control form-control-sm" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-sm flex-grow-1" style={{ backgroundColor: "#c7e3ff" }} onClick={addOrUpdateTask}>
            {editId ? "💾 Save Changes" : "➕ Add Task"}
          </button>
          {editId && (
            <button className="btn btn-sm btn-secondary" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card shadow-sm p-3" style={{ backgroundColor: "#f3f6ff" }}>
        <h5 style={{ color: "#6c63ff" }}>📋 Tasks ({tasks.length})</h5>
        {tasks.length === 0 ? (
          <p className="text-muted text-center py-4">No tasks found. Add your first task above!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-sm">
              <thead style={{ backgroundColor: "#dfe7ff" }}>
                <tr>
                  <th>Task</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Due Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.title}</strong>
                      {activeTimers[t.id] && <span className="badge bg-success ms-2">⏱️</span>}
                      <br />
                      <small className="text-muted">{t.description}</small>
                    </td>
                    <td>
                      {t.category_name && (
                        <span style={{ color: t.category_color }}>
                          ● {t.category_name}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadge(t.priority)}`}>
                        {getPriorityIcon(t.priority)} {t.priority}
                      </span>
                    </td>
                    <td>
                      {t.status === "completed" ? (
                        <span className="badge bg-success">✅ Done</span>
                      ) : (
                        <span className="badge bg-warning text-dark">🔄 Pending</span>
                      )}
                    </td>
                    <td>
                      {t.tags && t.tags.split(',').map((tag, i) => (
                        <span key={i} className="badge bg-light text-dark me-1">{tag.trim()}</span>
                      ))}
                    </td>
                    <td>
                      {t.due_date && (
                        <small>{new Date(t.due_date).toLocaleDateString()}</small>
                      )}
                    </td>
                    <td><strong>{formatTime(t.total_time)}</strong></td>
                    <td>
                      <div className="btn-group-vertical btn-group-sm">
                        <div className="btn-group btn-group-sm">
                          {!activeTimers[t.id] ? (
                            <button className="btn btn-outline-primary btn-sm" onClick={() => startTimer(t.id)}>▶</button>
                          ) : (
                            <button className="btn btn-outline-danger btn-sm" onClick={() => stopTimer(t.id)}>⏹</button>
                          )}
                          {t.status === "pending" ? (
                            <button className="btn btn-outline-success btn-sm" onClick={() => markStatus(t.id, "completed")}>✅</button>
                          ) : (
                            <button className="btn btn-outline-warning btn-sm" onClick={() => markStatus(t.id, "pending")}>🔄</button>
                          )}
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-secondary btn-sm" 
                            onClick={() => {
                              setTitle(t.title);
                              setDescription(t.description || "");
                              setCategoryId(t.category_id || "");
                              setPriority(t.priority);
                              setTags(t.tags || "");
                              setDueDate(t.due_date || "");
                              setEditId(t.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >✏️</button>
                          <button className="btn btn-outline-dark btn-sm" onClick={() => deleteTask(t.id)}>🗑</button>
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📁 Manage Categories</h5>
                <button className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Work, Personal"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <input 
                    type="color"
                    className="form-control"
                    value={newCategoryColor}
                    onChange={e => setNewCategoryColor(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary w-100" onClick={addCategory}>
                  Add Category
                </button>

                <hr />

                <h6>Existing Categories</h6>
                <div className="list-group">
                  {categories.map(cat => (
                    <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <span style={{ color: cat.color }}>●</span> {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}