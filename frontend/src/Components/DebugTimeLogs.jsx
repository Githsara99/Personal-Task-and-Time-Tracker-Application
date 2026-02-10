import { useEffect, useState } from "react";
import axios from "axios";

export default function DebugTimeLogs() {
  const userId = localStorage.getItem("userId");
  const [timeLogs, setTimeLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const fetchDebugData = () => {
    // Get time logs
    axios.get(`http://localhost:8081/debug/time-logs/${userId}`)
      .then(res => setTimeLogs(res.data))
      .catch(err => console.error(err));

    // Get analytics
    axios.get(`http://localhost:8081/analytics/${userId}`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return "0";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="container mt-4">
      <h3>Debug: Time Logs</h3>
      
      <div className="card p-3 mb-3">
        <h5>Analytics Data</h5>
        {analytics && (
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
        )}
      </div>

      <div className="card p-3">
        <h5>Recent Time Logs</h5>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Task</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration (seconds)</th>
              <th>Duration (readable)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {timeLogs.map(log => (
              <tr key={log.id}>
                <td>{log.title}</td>
                <td>{new Date(log.start_time).toLocaleString()}</td>
                <td>{log.end_time ? new Date(log.end_time).toLocaleString() : "Running"}</td>
                <td>{log.duration || 0}</td>
                <td>{formatTime(log.duration)}</td>
                <td>{new Date(log.start_time).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mt-3" onClick={fetchDebugData}>
        Refresh Data
      </button>
    </div>
  );
}