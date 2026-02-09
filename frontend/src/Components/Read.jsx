import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Read() {

    const { id } = useParams();
    const [student, setStudent] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8081/read/` + id)
        .then(res => {
            console.log(res)
            setStudent(res.data[0]);
        })
        .catch(err => console.log(err));
    }, [id])

        return(
         <div className="container mt-5">
      <div className="card shadow p-4">
        <h4 className="text-center mb-4 text-primary">
          Student Details
        </h4>

        <div className="mb-3">
          <strong>ID:</strong> {student.ID}
        </div>

        <div className="mb-3">
          <strong>Name:</strong> {student.Name}
        </div>

        <div className="mb-3">
          <strong>Email:</strong> {student.Email}
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
          <Link to={`/edit/${student.ID}`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
    )
}

export default Read