import React, {useState} from "react";
import axios from "axios";

function Create() {

  const [values, setValues] = useState({
    Name: "",
    Email: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/student', values)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  return (
    <div className="container mt-4">
  <div className="card shadow-sm p-3 mb-4" style={{ backgroundColor: "#f3f6ff" }}>
    <h5 className="text-center mb-3" style={{ color: "#6c63ff" }}>
      Add New Student
    </h5>

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter student name"
          style={{ backgroundColor: "#ffffff" }}
          onChange={e => setValues({ ...values, Name: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input 
          type="email" 
          className="form-control" 
          placeholder="Enter student email"
          style={{ backgroundColor: "#ffffff" }}
          onChange={e => setValues({ ...values, Email: e.target.value })}
        />
      </div>

      <button 
        type="submit" 
        className="btn w-100"
        style={{ backgroundColor: "#c7e3ff", border: "none" }}
      >
        Create Student
      </button>
    </form>
  </div>
</div>
  )
}

export default Create