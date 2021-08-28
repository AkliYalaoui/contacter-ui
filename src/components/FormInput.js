import { useState } from "react";
import { FaEye } from "react-icons/fa";

const FormInput = ({
  placeholder,
  value,
  label,
  type,
  children,
  onValueChanged,
  onKeyUp,
  notRequired,
}) => {
  const [inputType, setInputType] = useState(type);
  return (
    <div className="flex-1 flex flex-col relative px-2">
      {label && (
        <label className="text-gray-600 dark:text-white capitalize">
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <div
        className={`absolute ${
          label ? "top-9" : "top-4"
        } left-2 text-gray-600 dark:text-white`}
      >
        {children}
      </div>
      {notRequired ? (
        <input
          type={inputType}
          value={value}
          placeholder={placeholder ? placeholder : ""}
          onKeyUp={onKeyUp}
          onChange={(e) => onValueChanged(e.target.value)}
          className="text-gray-600 w-full dark:text-white border-b dark:bg-dark900 border-gray-300 dark:border-gray-600 outline-none focus:border-primary py-2 px-8"
        />
      ) : (
        <input
          type={inputType}
          required
          value={value}
          placeholder={placeholder ? placeholder : ""}
          onKeyUp={onKeyUp}
          onChange={(e) => onValueChanged(e.target.value)}
          className="text-gray-600 dark:text-white border-b dark:bg-dark900 border-gray-300 dark:border-gray-600 outline-none focus:border-primary py-2 px-8"
        />
      )}

      {type === "password" && (
        <span
          onClick={(_) =>
            inputType === "password"
              ? setInputType("text")
              : setInputType("password")
          }
          className="absolute top-4 right-2 cursor-pointer text-gray-600"
        >
          <FaEye />
        </span>
      )}
    </div>
  );
};

export default FormInput;
