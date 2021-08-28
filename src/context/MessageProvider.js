import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import MessageAlert from "../components/MessageAlert";

const MessageContext = createContext();
export const useMessageNotification = (_) => useContext(MessageContext);

const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [messageUser, setMessageUser] = useState("");
  const { socket } = useSocket();

  useEffect(() => {
    const receiveMessage = (m, u) => {
      setMessage(m);
      setMessageUser(u);
    };
    socket?.on("receive-message", receiveMessage);
    return () => socket?.removeListener("receive-message", receiveMessage);
  }, [socket]);

  return (
    <MessageContext.Provider value={null}>
      {message && messageUser && (
        <MessageAlert
          message={message}
          user={messageUser}
          setOpen={(v) => {
            setMessage(v);
            setMessageUser(v);
          }}
        />
      )}
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
