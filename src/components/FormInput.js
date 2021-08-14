import {useState} from 'react'
import { FaEye } from "react-icons/fa";

const FormInput = ({ label, type,children,onValueChanged }) => {
  
  const [inputType, setInputType] = useState(type)
  return (
    <div className="flex-1 flex flex-col relative px-2">
      <label className="text-gray-600 capitalize">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="absolute top-9 left-2 text-gray-600">
        {children}
    </div>
    <input
      type={ inputType}
      required
      onChange={e=> onValueChanged(e.target.value)}
      className="text-gray-600 border-b border-gray-300 outline-none focus:border-primary py-2 px-6"
      />
      {type === "password" && <span onClick={_ => inputType === "password" ? setInputType("text") : setInputType("password")}
                              className="absolute top-4 right-2 cursor-pointer text-gray-600"><FaEye/></span>}
  </div>
  )
}

export default FormInput
