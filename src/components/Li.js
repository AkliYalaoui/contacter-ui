import React from "react";

const Li = ({ children }) => {
  return (
    <li className="text-gray-600 dark:text-white flex items-center space-x-2 p-3 sm:p-4 border-b dark:border-gray-600  border-gray-300 hover:text-primary dark:hover:text-primary transition hover:border-primary">
      {children}
    </li>
  );
};

export default Li;
