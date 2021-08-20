import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import moment from "moment";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationProvider";

const Notification = () => {
  const { notifications, setNotifications } = useNotification();

  return (
    <div className="my-10">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="max-w-sm m-auto my-2 text-gray-600 dark:text-white  px-4 py-3 rounded bg-gray-200 dark:bg-dark800"
        >
          <div className="text-xs text-right">
            {moment(new Date(notification.createdAt)).fromNow()}
          </div>
          <div className="flex items-start">
            <img
              alt="profile"
              className="w-8 h-8 rounded-full object-cover mr-2"
              src={`http://localhost:8080/api/users/image/${notification.from.profilePhoto}`}
            />
            <div>
              <h3 className="font-bold">{notification.from.userName}</h3>
              <p>
                {notification.type === "like" && "Liked your post"}
                {notification.type === "request" &&
                  "Accepted your friend request"}
                {notification.type === "comment" &&
                  `Comment on your post : << ${notification.content} >>`}
              </p>
            </div>
          </div>
          {notification.type !== "request" && (
            <div className="w-max ml-auto bg-primary text-white p-1 hover:opacity-80 font-semibold rounded">
              <Link to={`/post/${notification.postId}`}>Check your post</Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notification;
