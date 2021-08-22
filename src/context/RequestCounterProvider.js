import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useAuth } from "./AuthProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const RequestCounterContext = createContext();
export const useRequestCounter = (_) => useContext(RequestCounterContext);

const RequestCounterProvider = ({ children }) => {
  const { user } = useAuth();
  const [counter, setCounter] = useState(0);
  const { socket } = useSocket();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const value = {
    counter,
    setCounter,
    friendSuggestions,
    friendRequests,
    setFriendRequests,
    setFriendSuggestions,
  };

  useEffect(() => {
    socket?.emit("join-room", user.id);
  }, [socket]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/friends/count`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCounter(data.friendRequestsCount);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const receiveRequest = (id, r) => {
      setFriendRequests((prev) => [r, ...prev]);
      setCounter((prev) => prev + 1);
      setFriendSuggestions((prev) => {
        return prev.filter((friend) => {
          return friend._id !== r.requester._id;
        });
      });
    };
    socket?.on("receive-request", receiveRequest);
    return () => socket?.removeListener("receive-request", receiveRequest);
  }, [socket]);

  return (
    <RequestCounterContext.Provider value={value}>
      {children}
    </RequestCounterContext.Provider>
  );
};

export default RequestCounterProvider;
