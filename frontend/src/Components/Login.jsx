// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const login = () => {
//     axios.post("http://localhost:8081/login", {
//   email,
//   password
// })

//       .then(res => {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("userId", res.data.userId);
//         navigate("/dashboard");
//       });
//   };

//   return (
//     <div className="container mt-5 d-flex justify-content-center">
//       <div className="card shadow-sm p-4" style={{ width: "400px", backgroundColor: "#f3f6ff" }}>
//         <h4 className="text-center mb-3" style={{ color: "#6c63ff" }}>
//           🔐 Login
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
//           onClick={login}>
//           Login
//         </button>

//         <div className="text-center">
//           <Link to="/register">Create new account</Link>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    axios.post("http://localhost:8081/login", {
      email,
      password
    })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      navigate("/dashboard");
    })
    .catch(err => {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4" style={{ width: "400px", backgroundColor: "#f3f6ff" }}>
        <h4 className="text-center mb-3" style={{ color: "#6c63ff" }}>
          🔐 Login
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
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button 
          className="btn w-100 mb-2" 
          style={{ backgroundColor: "#c7e3ff", border: "none" }}
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <Link to="/register">Create new account</Link>
        </div>
      </div>
    </div>
  );
}