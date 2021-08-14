import React from 'react'

const Button = ({children,classes}) => {
  return (
    <button className={` py-2 cursor-pointer px-4 border-0 outline-none rounded hover:bg-opacity-80 text-white ${classes}`}>
      {children}
  </button>
  )
}

export default Button
