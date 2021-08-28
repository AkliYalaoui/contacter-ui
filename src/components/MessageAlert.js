import { useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MessageAlert = ({ message, user, setOpen }) => {
  const btn = useRef();
  useEffect(() => {
    setTimeout(() => {
      btn.current?.click();
    }, 6000);
  }, []);
  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 bg-white text-gray-600 dark:text-white dark:bg-dark800 flex items-start p-2 shadow-lg w-60">
      <img
        alt="profile"
        className="object-contain w-8 h-8 rounded-full mr-2"
        src={`${BASE_URL}/api/users/image/${user.profilePhoto}`}
      />
      <div>
        <h3 className="font-bold">{user.userName}</h3>
        <p className="text-sm break-all">
          {message.content !== "" ? message.content : "sent an attachement"}
        </p>
      </div>
      <button
        ref={btn}
        onClick={(_) => setOpen(false)}
        className="ml-auto block cursor-pointer rounded-full p-3 hover:bg-gray-200 dark:hover:bg-dark900"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default MessageAlert;
