import { useState, useEffect } from "react";

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
      className={`flex my-4 items-start ${
        message.sender === user.id ? "flex-row-reverse" : ""
      }`}
    >
      <img
        alt="profile"
        className="w-8 h-8 rounded-full"
        src={`${BASE_URL}/api/users/image/${person.profilePhoto}`}
      />
      <div
        className={`flex flex-col ${
          message.sender === user.id ? "items-end" : ""
        }`}
      >
        <p
          className={`bg-white dark:bg-dark900 shadow py-1 px-2 rounded w-max ${
            message.sender === user.id ? "mr-2" : "ml-2"
          }`}
        >
          {message.content}
        </p>
        <div className="my-2">
          {message.hasImage === true &&
            (message.image.type === "video" ? (
              <video
                src={`${image}`}
                className="object-cover w-28 h-28"
                controls
              ></video>
            ) : (
              <img className="object-cover w-28 h-28" src={`${image}`} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Message;
