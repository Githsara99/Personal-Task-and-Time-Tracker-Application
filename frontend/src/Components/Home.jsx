

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:8081/")
      .then(res => {
        console.log("Received data:", res.data);
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setError("Invalid data format received");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [])

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Loading students...</p>
      </div>
    )

  if (error)
    return (
      <div className="container mt-5 alert alert-danger text-center">
        Error: {error}
      </div>
    )

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/delete/` + id)
      .then(res => { 
        location.reload();
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="container mt-4">

      {/* Header Card */}
      <div className="card shadow-sm p-3 mb-3" style={{ backgroundColor: "#f3f6ff" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ color: "#6c63ff" }}>📚 Student List</h5>

          <Link to="/create" className="btn btn-sm"
            style={{ backgroundColor: "#c7e3ff", border: "none" }}>
            ➕ Create Student
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm p-3" style={{ backgroundColor: "#f3f6ff" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#dfe7ff" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((student, index) => (
                  <tr key={index}>
                    <td>{student.Name}</td>
                    <td>{student.Email}</td>
                    <td>{student.ID}</td>
                    <td>
                      <Link to={`/read/${student.ID}`} className="btn btn-sm me-2"
                        style={{ backgroundColor: "#c7e3ff", border: "none" }}>
                        ✏️ Read
                      </Link>

                      <Link to={`/edit/${student.ID}`} className="btn btn-sm me-2"
                        style={{ backgroundColor: "#c7e3ff", border: "none" }}>
                        ✏️ Update
                      </Link>

                      <button onClick={() => handleDelete(student.ID)} className="btn btn-sm"
                        style={{ backgroundColor: "#ffd6e6", border: "none" }}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home
