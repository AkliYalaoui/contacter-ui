import React from 'react'

const Empty = ({icon,content}) => {
  return (
    <div className="text-gray-600 dark:text-white mt-4 flex flex-col items-center justify-center">
      {icon}
      <span className="capitalize mt-2 text-center">{ content}</span>
  </div>
  )
}

export default Empty
