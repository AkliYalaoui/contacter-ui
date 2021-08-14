import React from 'react'

const Error = ({content}) => {
  return (
    <div className="text-red-800 font-semibold bg-red-100 px-4 py-2 text-center rounded">
      <p>{content}</p>
    </div>
  )
}

export default Error
