import { FaBell, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Alert = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open ? (
        <div className="text-gray-600 dark:text-white p-2 rounded fixed top-1 left-1/2 transform -translate-x-1/2 shadow-lg bg-white dark:bg-dark800">
          <button
            onClick={(_) => setOpen(false)}
            className="ml-auto block cursor-pointer rounded-full p-3 hover:bg-gray-200 dark:hover:bg-dark900"
          >
            <FaTimes />
          </button>
          <div>
            <span className="text-xl inline-block mr-5 align-middle">
              <FaBell />
            </span>
            <span className="inline-block align-middle mr-8">{children}</span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Alert;
