// import React, {useEffect, useState} from "react"
// import axios from "axios"

// function Home() {

//     const [data, setData] = useState([])

//     useEffect(() => {
//         axios.get('http://localhost:8081/')
//         //.then(res => setData(res.data))
//         .then(res => {
//         console.log(res.data);
//         setData(res.data);
//         })
//         .catch(err => console.log(err));
//     }, [])

//   return (
//     <div>
//       <div>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>ID </th>
//                     <th>Action</th>
//                 </tr>
//             </thead>
//            <tbody>
//   {Array.isArray(data) && data.map((student, index) => {
//     return (
//       <tr key={index}>
//         <td>{student.Name}</td>
//         <td>{student.Email}</td>
//         <td>{student.ID}</td>
//         <td>
//           <button>Update</button>
//           <button>Delete</button>
//         </td>
//       </tr>
//     );
//   })}
// </tbody>

//         </table>
//       </div>
//     </div>
//   )
// }   

// export default Home


import React, {useEffect, useState} from "react"
import axios from "axios"

function Home() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:8081/')
        .then(res => {
            console.log("Received data:", res.data);
            if(Array.isArray(res.data)) {
                setData(res.data);
            } else {
                console.error("Data is not an array:", res.data);
                setError("Invalid data format received");
            }
            setLoading(false);
        })
        .catch(err => {
            console.log("Error:", err);
            setError(err.message);
            setLoading(false);
        });
    }, [])

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error: {error}</div>

    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                          
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                            <th>ID</th>
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
                                        <button>Update</button>
                                        <button>Delete</button>
                                    </td>  
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No students found</td>
                            </tr>
                        )}       
                    </tbody>
                </table>
            </div>
        </div>
    )
}   

export default Home