import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Message = ({ message, user, person }) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!message.image || !message?.image?.url) return;

    fetch(`${BASE_URL}/api/conversations/image/${message.image.url}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.blob())
      .then((data) => {
        setImage(URL.createObjectURL(data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [message.image]);

  return (
    <div
      className={`flex p-2 my-3 items-start ${
        message.sender === user.id ? "flex-row-reverse" : ""
      }`}
    >
      <img
        alt="profile"
        className={`w-6 h-6 object-contain rounded-full ${
          message.sender === user.id ? "mr-1" : ""
        }`}
        src={`${BASE_URL}/api/users/image/${person.profilePhoto}`}
      />
      <div
        className={`flex flex-col ${
          message.sender === user.id ? "items-end" : ""
        }`}
      >
        {message.content && (
          <p
            className={`bg-white dark:bg-dark900 shadow py-1 px-2 rounded max-w-xs break-all ${
              message.sender === user.id ? "mr-1" : "ml-1"
            }`}
          >
            {message.content}
          </p>
        )}
        {message.hasImage === true && (
          <div className={`m-1`}>
            {message.image.type === "video" ? (
              <video
                src={`${image}`}
                className={`object-contain h-36 w-36`}
                controls
              ></video>
            ) : (
              <img className={`object-contain h-36 w-36`} src={`${image}`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
