import React from "react";

const Li = ({ children }) => {
  return (
    <li className="text-gray-600 flex items-center space-x-2 p-3 sm:p-4 border-b border-gray-300 hover:text-primary transition hover:border-primary">
      {children}
    </li>
  );
};

export default Li;
