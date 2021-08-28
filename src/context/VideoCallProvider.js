import { useContext, useEffect, useRef, useState, createContext } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import Peer from "simple-peer";
import VideoCallAlert from "../components/VideoCallAlert";
import VideoChat from "../components/VideoChat";

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

  const [friendToCall, setFriendToCall] = useState();

  useEffect(() => {
    const onUserCalling = ({ from, name, signal,profilePhoto }) => {
      setCall({ isReceivingCall: true, from, name, signal,profilePhoto });
    };

    const onCallEnded = (id) => {
      setCallEnded(true);
      connectionRef.current && connectionRef.current.destroy();
      window.location.reload();
    };

    socket?.on("call-canceled", onCallEnded);
    socket?.on("user-calling", onUserCalling);
    return () => {
      socket?.removeListener("user-calling", onUserCalling);
      socket?.removeListener("call-canceled", onCallEnded);
    };
  }, [socket]);

  const answerCall = () => {
    setCallAccepted(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current && (myVideo.current.srcObject = stream);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("answer-call", { signal: data, to: call.from });
        });

        peer.on("stream", (s) => {
          userVideo.current && (userVideo.current.srcObject = s);
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const callUser = (userTocall) => {
    setFriendToCall(userTocall);
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
            profilePhoto:user.profilePhoto
          });
        });

        peer.on("stream", (s) => {
          userVideo.current && (userVideo.current.srcObject = s);
        });

        socket.on("call-accepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });
        connectionRef.current = peer;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const leaveCall = () => {
    socket.emit("call-ended", call.from ?? friendToCall);
    setCallEnded(true);
    connectionRef.current && connectionRef.current.destroy();
    window.location.reload();
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
        <VideoCallAlert
          onAnswer={answerCall}
          onCancel={leaveCall}
          call={call}
        />
      )}
      {callAccepted && !callEnded && (
        <VideoChat
          closeModal={leaveCall}
          myVideo={myVideo}
          userVideo={userVideo}
          callRunning={callAccepted && !callEnded}
        />
      )}

      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
