import { useState, createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocket = (_) => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
    return () => socket?.close();
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
