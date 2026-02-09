import React, {useEffect, useState} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Edit() {
    
    const { id } = useParams();
    const navigate = useNavigate();
     const [values, setValues] = useState({
        Name: '',
        Email: ''
    })
  //  const [student, setStudent] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8081/read/` + id)
        .then(res => {
            console.log(res)
            setValues({
                Name: res.data[0].Name,
                Email: res.data[0].Email
            });
        })
        .catch(err => console.log(err));
    }, [id])

   const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/edit/` + id, values)
    .then(res => {
        console.log(res);
        navigate('/');
        })
    .catch(err => console.log(err));
    }

    return(
        <div className="container mt-4">
      <div className="card shadow-sm p-4" style={{ backgroundColor: "#f3f6ff" }}>
        <h5 className="text-center mb-3" style={{ color: "#6c63ff" }}>
          ✏️ Edit Student
        </h5>

        <form onSubmit = {handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="Name"
              value={values.Name}
              onChange={e => setValues({ ...values, Name: e.target.value })}
              className="form-control"
              placeholder="Enter name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="Email"
              value={values.Email}
              onChange={e => setValues({ ...values, Email: e.target.value })}
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="d-flex justify-content-between">
            <Link to="/" className="btn btn-secondary">
            Back
          </Link>
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "#c7e3ff", border: "none" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    )
} 

export default Edit