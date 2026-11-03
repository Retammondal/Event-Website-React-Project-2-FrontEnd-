import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import { Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'

function App() {

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
