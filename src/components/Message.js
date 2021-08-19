import React from "react";

const Message = ({ message, user, person }) => {
  return (
    <div
      className={`flex my-4 items-start ${
        message.sender === user.id ? "flex-row-reverse" : ""
      }`}
    >
      <img
        alt="profile"
        className="w-8 h-8 rounded-full"
        src={`http://localhost:8080/api/users/image/${person.profilePhoto}`}
      />
      <div
        className={`flex flex-col ${
          message.sender === user.id ? "items-end" : ""
        }`}
      >
        <p
          className={`bg-white shadow py-1 px-2 rounded w-max ${
            message.sender === user.id ? "mr-2" : "ml-2"
          }`}
        >
          {message.content}
        </p>
        <div className="my-2">
          {message.hasImage === true &&
            (message.image.type === "video" ? (
              <video
                src={`http://localhost:8080/api/conversations/image/${message.image.url}`}
                className="object-cover w-28 h-28"
                controls
              ></video>
            ) : (
              <img
                className="object-cover w-28 h-28"
                src={`http://localhost:8080/api/conversations/image/${message.image.url}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Message;
