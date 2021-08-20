import React from "react";

const TextArea = ({ value, label, placeholder, children, onValueChanged }) => {
  return (
    <div className="flex-1 flex flex-col relative px-2 text-gray-600 dark:text-white">
      {label && (
        <label className="capitalize">
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <div className="absolute top-9 left-2 ">{children}</div>
      <textarea
        rows={3}
        onChange={(e) => onValueChanged(e.target.value)}
        className=" border-b border-gray-300 dark:border-gray-600 dark:bg-dark900 outline-none focus:border-primary py-2 px-6"
        placeholder={placeholder}
        value={value}
        required
      />
    </div>
  );
};

export default TextArea;
