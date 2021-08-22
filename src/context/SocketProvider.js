import { useState, createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const SocketContext = createContext();
export const useSocket = (_) => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io(`${BASE_URL}`));
    return () => socket?.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
