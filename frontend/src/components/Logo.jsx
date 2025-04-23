import React from 'react'
import images from "../constant/Icon";
function Logo() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-r from-slate-500 to-slate-950 text-white h-16 shadow-md">
            <h1 className="text-xl font-bold font-mono">
            <BackButton icon={images.btn} label="Go Back" />
              Logo</h1>
    </div>
  )
}

export default Logo