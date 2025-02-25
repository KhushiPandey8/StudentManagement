import React from 'react'
import images from '../constant/Icon'

function Image() {
  return (
    
    <div className="hidden md:flex w-[40%] items-center justify-center">
    <img
      src={images.student}
      alt="Student"
      className="max-w-full h-full object-cover"
    />
  </div>
  )
}

export default Image