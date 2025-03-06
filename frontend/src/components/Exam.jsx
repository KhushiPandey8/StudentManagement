import React from 'react'
import Logo from './Logo'
import Image from './Image'
import Footer from './Footer'

function Exam() {
  return (
    <>
      <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
    <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
      <Logo />
      <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
        </div>
        <Footer/>
        </div>
        <Image/>    
        </div>
    </>
   
  )
}

export default Exam