import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Msi#1999',
    database: 'crud'
});

db.connect((err) => {
    if(err) {
        console.error("Failed to connect to database:", err);
        return;
    }
    console.log("Successfully connected to MySQL database 'crud'");
});

// app.get('/', (req, res) => {
//     const sql = "SELECT * FROM student";
//     db.query(sql, (err, result) => {
//       //  if(err) return res.json({Message: "Error inside server"});
//       if(err) return res.json([]);

//         return res.json(result);
//     })
// });

app.get('/', (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, result) => {
        if(err) {
            console.log("Database error:", err); // This will show the real error
            return res.json({Message: "Error inside server", Error: err.message});
        }
        console.log("Query successful, rows:", result.length);
        return res.json(result);
    })
});

// app.post('/student', (req, res) => {
//     const sql = "INSERT INTO student (Name, Email) VALUES (?, ?)";
//     const values = [req.body.Name, req.body.Email];
//     db.query(sql, values, (err, result) => {
//         if(err) return res.json({Message: "Error inside server", Error: err.message});
//         return res.json({Message: "Student created successfully", result});
//     })
// });

app.post('/student', (req, res) => {
    console.log("Received data:", req.body);
    const sql = "INSERT INTO student (`Name`, `Email`) VALUES (?, ?)";
    const values = [req.body.Name, req.body.Email];
    console.log("Values array:", values);
    
    db.query(sql, values, (err, result) => {
        if(err) {
            console.log("SQL Error:", err);
            return res.json({Message: "Error inside server", Error: err.message});
        }
        return res.json({Message: "Student created successfully", result});
    })
});

app.listen(8081, ()=>{
    console.log("Server is running on port 8081");
});