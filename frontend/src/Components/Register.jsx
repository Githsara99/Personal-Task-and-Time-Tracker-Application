// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const register = () => {
//     axios.post("http://localhost:8081/register", { email, password })
//       .then(() => navigate("/"));
//   };

//   return (
//     <div className="container mt-5 d-flex justify-content-center">
//       <div className="card shadow-sm p-4" style={{ width: "400px", backgroundColor: "#f3f6ff" }}>
//         <h4 className="text-center mb-3" style={{ color: "#6c63ff" }}>
//           📝 Create Account
//         </h4>

//         <input 
//           className="form-control mb-2"
//           placeholder="Email"
//           onChange={e => setEmail(e.target.value)} 
//         />

//         <input 
//           type="password"
//           className="form-control mb-3"
//           placeholder="Password"
//           onChange={e => setPassword(e.target.value)} 
//         />

//         <button className="btn w-100 mb-2"
//           style={{ backgroundColor: "#c7e3ff", border: "none" }}
//           onClick={register}>
//           Register
//         </button>

//         <div className="text-center">
//           <Link to="/">Back to Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = () => {
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    axios.post("http://localhost:8081/register", { email, password })
      .then(() => {
        alert("Registration successful! Please login.");
        navigate("/");
      })
      .catch(err => {
        console.error("Registration error:", err);
        setError(err.response?.data?.error || "Registration failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4" style={{ width: "400px", backgroundColor: "#f3f6ff" }}>
        <h4 className="text-center mb-3" style={{ color: "#6c63ff" }}>
          📝 Create Account
        </h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <input 
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <input 
          type="password"
          className="form-control mb-2"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <input 
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button 
          className="btn w-100 mb-2"
          style={{ backgroundColor: "#c7e3ff", border: "none" }}
          onClick={register}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}