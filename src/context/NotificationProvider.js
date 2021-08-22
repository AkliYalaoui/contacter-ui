import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const NotificationContext = createContext();
export const useNotification = (_) => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notificationsCounter, setNotificationsCounter] = useState(0);
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const value = {
    notificationsCounter,
    setNotificationsCounter,
    notifications,
    setNotifications,
  };

  useEffect(() => {
    socket?.emit("join-room", user.id);
  }, [socket]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/notifications`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setNotifications(data.notifications);
          setNotificationsCounter(data.notifications.length);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token]);

  useEffect(() => {
    const receiveNotification = (id, n) => {
      setNotifications((prev) => [n, ...prev]);
      setNotificationsCounter((prev) => prev + 1);
    };
    socket?.on("receive-notification", receiveNotification);
    return () =>
      socket?.removeListener("receive-notification", receiveNotification);
  }, [socket]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
