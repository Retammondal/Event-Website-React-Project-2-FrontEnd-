import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import NotFound from './pages/NotFound'
import { CircleUserRound } from 'lucide-react'
import { Button } from '@base-ui/react/button'


function App() {
  

  return (
    <div>
      <Navbar/>
      <CircleUserRound />
      
      <Routes>
        <Route path='/' element={<p>Home Page</p>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;
