import { FaTimes } from "react-icons/fa";

const Error = ({ content, setOpen }) => {
  return (
    <div className="text-red-800 flex flex-row-reverse items-start font-semibold bg-red-100 px-4 py-2 text-center rounded">
      <button
        onClick={(_) => setOpen(false)}
        className="ml-auto block cursor-pointer rounded-full p-3 hover:bg-gray-200"
      >
        <FaTimes />
      </button>
      <p className="flex-1">{content}</p>
    </div>
  );
};

export default Error;
