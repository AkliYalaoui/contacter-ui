import { useContext, useEffect, useRef, useState, createContext } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import Peer from "simple-peer";
import Alert from "../components/Alert";

const VideoCallContext = createContext();
export const useVideoCall = (_) => useContext(VideoCallContext);

const VideoCallProvider = ({ children }) => {
  const { socket } = useSocket();
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const { user } = useAuth();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const onUserCalling = ({ from, name, signal }) => {
      console.log({ from, name, signal });
      setCall({ isReceivingCall: true, from, name, signal });
    };

    socket?.on("user-calling", onUserCalling);
    return () => {
      socket?.removeListener("user-calling", onUserCalling);
    };
  }, [socket]);

  const answerCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current && (myVideo.current.srcObject = stream);
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("answer-call", { signal: data, to: call.from });
        });

        peer.on("stream", (stream) => {
          userVideo.current && (userVideo.current.srcObject = stream);
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
      });
  };

  const callUser = (userTocall) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current && (myVideo.current.srcObject = stream);
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("call-user", {
            userTocall,
            signalData: data,
            from: user.id,
            name: user.userName,
          });
        });

        peer.on("stream", (stream) => {
          userVideo.current && (userVideo.current.srcObject = stream);
        });

        socket.on("call-accepted", (signal) => {
          console.log(signal);
          setCallAccepted(true);
          peer.signal(signal);
        });
        connectionRef.current = peer;
      });
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current && connectionRef.current.destroy();
  };

  return (
    <VideoCallContext.Provider
      value={{
        leaveCall,
        answerCall,
        callUser,
        myVideo,
        callAccepted,
        callEnded,
        userVideo,
        stream,
      }}
    >
      {call.isReceivingCall && !callEnded && !callAccepted && (
        <Alert setOpen={leaveCall}>
          <p className="dark:bg-dark900 dark:text-white p-1 rounded">
            {call.name} is calling ...
          </p>
          <div className="flex justify-between flex-wrap mt-2">
            <button
              className="bg-primary text-white cursor-pointer p-1 rounded"
              onClick={answerCall}
            >
              Answer
            </button>
            <button
              className="bg-red-600 text-white cursor-pointer p-1 rounded"
              onClick={leaveCall}
            >
              Decline
            </button>
          </div>
        </Alert>
      )}
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
