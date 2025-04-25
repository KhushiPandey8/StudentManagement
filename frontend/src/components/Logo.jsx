import React from 'react'

function Logo() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-950 text-white h-16 shadow-md">
          <img
        src={logoImg}
        alt="I-tech Logo"
        className="h-10 w-10 mr-3 rounded-full border-2 border-white shadow-lg"
      />
      <h1 className="text-2xl font-extrabold font-mono tracking-widest">I-tech</h1>
    </div>
  )
}

export default Logo