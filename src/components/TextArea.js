import React from 'react'

const TextArea = ({label,placeholder,children,onValueChanged}) => {
  return (
    <div className="flex-1 flex flex-col relative px-2">
      {label && <label className="text-gray-600 capitalize">
        {label} <span className="text-red-500">*</span>
      </label>}
      <div className="absolute top-9 left-2 text-gray-600">
        {children}
    </div>
      <textarea
        rows={3}
        onChange={e=> onValueChanged(e.target.value)}
        className="text-gray-600 border-b border-gray-300 outline-none focus:border-primary py-2 px-6"
        placeholder={placeholder}
      />
  </div>
  )
}

export default TextArea
