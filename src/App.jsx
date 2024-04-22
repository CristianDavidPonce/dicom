import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Movil from './views/Movil'
import General from './views/General'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<General />} />
        <Route path="movil" element={<Movil />} />
      </Routes>
    </div>
  )
}
export default App
