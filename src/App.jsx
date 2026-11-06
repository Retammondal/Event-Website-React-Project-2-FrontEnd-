import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { Route, Routes, useLocation } from 'react-router'
import NotFound from './pages/NotFound'
import HomePage from './pages/HomePage'

// ! Problem : Due to Route as No Reload, if we switch to another page it stays in same position rather than going to Top
// * Solution : It's give the solution to when new page loads it goes to Top
// Dependency Array : whenever we go from one page to another url is changing
function ScrollToTop(){
  const {pathname} = useLocation();         // gives a lot of things of which pathName is needed
  useEffect(()=>{
    window.scrollTo({top : 0});
  },[pathname])
}


function App() {

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-orange-100 selection:text-[#E65100]">
      <ScrollToTop/>
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
