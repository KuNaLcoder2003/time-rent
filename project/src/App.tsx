import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Categories from './components/Categories';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { Routes , Route } from 'react-router-dom';
import SignUp from './components/Signup';
import SignIn from './components/Signin';
import Dashboard from './components/Dashboard';
import SetAvailability from './components/SetAvailabilty';
import BookingPage from './components/BookingPage';
import Success from './components/Success';

function App() {
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token || token.length < 6) {
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
  } , [])
  return (
    <Routes>
      <Route path='/' element={<Landing/>} />
      <Route path='/signup' element={isLoggedIn ? <Dashboard/> : <SignUp/>} />
      <Route path='/signin' element = {isLoggedIn ? <Dashboard/> :<SignIn setIsLoggedIn={setIsLoggedIn} /> } />
      <Route path='/dashboard' element={isLoggedIn ? <Dashboard/> : <SignIn setIsLoggedIn={setIsLoggedIn}/>} />
      <Route path='/dashboard/availabililty/:email' element={isLoggedIn ? <SetAvailability/> : <SignIn setIsLoggedIn={setIsLoggedIn}/>} />
      <Route path='/book/:email' element={<BookingPage/>} />
      <Route path='/success/:email/:id' element={<Success/>} />
      <Route path='/cancel' element={<div>Payment failed</div>} />
    </Routes>
  )
}


const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App;