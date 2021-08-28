import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ConversationContext = createContext();
export const useOnlineUsers = (_) => useContext(ConversationContext);

const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversationsError, setConversationsError] = useState();
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();

  const value = {
    conversations,
    conversationsError,
    conversationsLoading,
    onlineUsers,
  };

  // useEffect(() => {
  //   const addOnlineUser = (u) => {
  //     if (!onlineUsers.some((us) => us.id === u.id)) {
  //       setOnlineUsers((prev) => [...new Set([u, ...prev])]);
  //       socket.emit("set-online", u.id, {
  //         userName: user.userName,
  //         id: user.id,
  //       });
  //     }
  //   };
  //   socket?.on("receive-online-user", addOnlineUser);
  //   return () => socket?.removeListener("receive-online-user", addOnlineUser);
  // }, [socket]);

  useEffect(() => {
    setConversationsLoading(true);
    fetch(`${BASE_URL}/api/conversations`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversationsLoading(false);
        if (data.success) {
          setConversations(data.conversations);
          // data.conversations.forEach((conversation) => {
          //   const id =
          //     user.id === conversation.member_a._id
          //       ? conversation.member_b._id
          //       : conversation.member_a._id;
          //   console.log(id);
          //   socket?.emit("set-online", id, {
          //     userName: user.userName,
          //     id: user.id,
          //   });
          // });
        } else setConversationsError(data.error);
      })
      .catch((err) => {
        console.log(err);
        setConversationsError(
          "something went wrong while trying to get the conversations,please try again"
        );
      });
  }, [user.token, socket]);

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
