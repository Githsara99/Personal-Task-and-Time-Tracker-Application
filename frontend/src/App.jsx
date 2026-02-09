import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./Components/Home"
import Create from "./Components/Create"
import Read from "./Components/Read"
import Edit from "./Components/Edit"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<Create />} />
        <Route path='/read/:id' element={<Read />} />
        <Route path='/edit/:id' element={<Edit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
