import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './views/Home'
import Movil from './views/Movil'

function App () {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="movil" element={<Movil />} />
      </Routes>
    </div>
  )
}
export default App
