import React from 'react'

function Logo() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-950 text-white h-16 shadow-md">
            <FaGraduationCap className="text-2xl text-yellow-300 animate-pulse" />
      <h1 className="text-2xl font-bold font-mono tracking-wide">
        I-Tech Institute
      </h1>
    </div>
  )
}

export default Logo