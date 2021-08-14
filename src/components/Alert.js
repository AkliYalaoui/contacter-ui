import { FaBell } from 'react-icons/fa';

const Alert = ({children}) => {
  return (
    <div className="text-gray-600 px-6 py-4 rounded fixed top-1 left-1/2 transform -translate-x-1/2 shadow-lg bg-white">
      <span className="text-xl inline-block mr-5 align-middle">
        <FaBell/>
      </span>
      <span className="inline-block align-middle mr-8">
        {children}
      </span>
  </div>
  )
}

export default Alert
