import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router'
import NotFound from './pages/NotFound'
import HomePage from './pages/HomePage'

function App() {

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-orange-100 selection:text-[#E65100]">
      <Navbar/>
      {/* This lower div flex-1 b/c rest spaces will be taken */}
      <div className='flex-1'>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
        <Footer/>
    </div>
  )
}

export default App
