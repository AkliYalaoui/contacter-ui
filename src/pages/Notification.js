import moment from "moment";
import { Link } from "react-router-dom";
import Empty from "../components/Empty";
import { useNotification } from "../context/NotificationProvider";
import { ImSad } from "react-icons/im";
import { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Notification = () => {
  const { notifications, setNotificationsCounter } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${BASE_URL}/api/notifications/read`, {
      method: "PUT",
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotificationsCounter(0);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token]);

  return (
    <div className="my-10">
      {notifications.length === 0 && (
        <Empty icon={<ImSad />} content="No notification to display " />
      )}
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
              className="w-8 h-8 rounded-full object-contain mr-2"
              src={`${BASE_URL}/api/users/image/${notification.from.profilePhoto}`}
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
