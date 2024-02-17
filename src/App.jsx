import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Project from './components/Project'
import { isWalletConnected } from './services/blockchain'
import { ToastContainer } from 'react-toastify'

const App = () => {
  
  const [ loaded , setLoaded ] = useState(false) ;

  // checking for wallet connection
  useEffect(() => {
    const fetchData = async () => {
      await isWalletConnected();
      console.log('Wallet loaded !! ');
      setLoaded(true) ;
    };
    fetchData();
  }, []);

  return (
    <div className='min-h-screen relative'>
      <Header />
      {
        loaded ? (<Routes> 
        <Route path="/" element ={<Home />} />  
        <Route path="/projects/:id" element={<Project />} />
      </Routes>) : null
      }

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App