import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { useVideoCall } from "../context/VideoCallProvider";
import Empty from "../components/Empty";
import { BsChatDotsFill } from "react-icons/bs";
import Error from "../components/Error";
import { useParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { MdSend } from "react-icons/md";
import { useSocket } from "../context/SocketProvider";
import { FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostField from "../components/PostField";
import Message from "../components/Message";
import Typing from "../components/Typing";
import Loading from "../components/Loading";
import VideoChat from "../components/VideoChat";
import EmojiPicker from "../components/EmojiPicker";
import { HiEmojiHappy } from "react-icons/hi";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Chat = () => {
  const { user } = useAuth();
  const videoCall = useVideoCall();
  const [openEmoji, setOpenEmoji] = useState(false);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [mounted, setMounted] = useState(false);
  const scrollbars = useRef();
  const [friend, setFriend] = useState();
  const [messagesError, setMessagesError] = useState();
  const [message, setMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [typing, setTyping] = useState("");
  const { socket } = useSocket();
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [openVideo, setOpenVideo] = useState(false);
  const [imageType, setImageType] = useState("image");

  const onEmojiClick = (emoji) => {
    setMessage((prev) => `${prev}${emoji}`);
  };

  const fileChanged = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageType(file.type.split("/")[0]);
    }
  };

  useEffect(() => {
    socket?.emit("join-conversation", id);
  }, [socket]);

  useEffect(() => {
    const receiveMessage = (m) => {
      setMessages((prev) => [...prev, m]);
    };
    socket?.on("receive-message", receiveMessage);
    return () => socket?.removeListener("receive-message", receiveMessage);
  }, [socket]);

  useEffect(() => {
    const typing = (m) => {
      setTyping(m);
      scrollbars.current.scrollToBottom();
    };
    socket?.on("typing", typing);
    return () => socket?.removeListener("typing", typing);
  }, [socket]);

  useEffect(() => {
    const typing = (m) => {
      setTyping(m);
    };
    socket?.on("not-typing", typing);
    return () => socket?.removeListener("not-typing", typing);
  }, [socket]);

  useEffect(() => {
    scrollbars.current && scrollbars.current.scrollToBottom();
  }, [mounted]);

  const userTyping = (val) => {
    setMessage(val);
    if (val.trim()) socket.emit("user-typing", id);
  };
  const userNotTyping = (_) => {
    setTimeout(() => {
      socket.emit("user-not-typing", id);
    }, 1000);
  };
  const sendMessageHandler = (e) => {
    e.preventDefault();

    if (!image && !message) {
      // setMessagesError("Can't create an empty message");
      return;
    }

    const body = new FormData();
    body.append("content", message);
    if (image) {
      body.append("messagePhoto", image);
    }

    fetch(`${BASE_URL}/api/conversations/${id}`, {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages((prev) => [...prev, data.message]);
          socket.emit("send-message", id, data.message);
          scrollbars.current.scrollToBottom();
          setMessage("");
          setImage(null);
          setImagePreview(null);
        } else setMessagesError(data.error);
      })
      .catch((err) => {
        console.log(err);
        setMessagesError(
          "something went wrong while trying to get the messages,please try again"
        );
      });
  };
  useEffect(() => {
    setMessageLoading(true);
    fetch(`${BASE_URL}/api/conversations/${id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessageLoading(false);
        if (data.success) {
          console.log(data.conversation.messages);
          setMessages(data.conversation.messages);
          setFriend(() => {
            if (data.conversation.member_b._id === user.id)
              return data.conversation.member_a;
            return data.conversation.member_b;
          });
          setMounted(true);
        } else setMessagesError(data.error);
      })
      .catch((err) => {
        console.log(err);
        setMessagesError(
          "something went wrong while trying to get the messages,please try again"
        );
      });
  }, [user.token, user.id, id]);

  const MakeVideoCall = () => {
    const videoChat = new Promise((resolve, reject) => {
      setOpenVideo(true);
      resolve();
    });

    videoChat.then(() => videoCall.callUser(friend._id));
  };
  const endCall = () => {
    setOpenVideo(false);
    videoCall.leaveCall();
  };

  if (messageLoading) {
    return <Loading />;
  }
  return (
    <div className="mt-4">
      {openVideo && videoCall.stream && !videoCall.callEnded && (
        <VideoChat
          closeModal={endCall}
          myVideo={videoCall.myVideo}
          userVideo={videoCall.userVideo}
          callRunning={videoCall.callAccepted && !videoCall.callEnded}
        />
      )}
      {messagesError && (
        <Error setOpen={setMessagesError} content={messagesError} />
      )}
      <section className="bg-gray-100 dark:bg-dark800 shadow text-gray-600 dark:text-white">
        {friend && !messagesError && (
          <>
            <header className="py-1 sm:py-2 px-4 justify-between flex items-center shadow">
              <div className="space-x-4 flex items-start">
                <Link to={`/profile/${friend._id}`}>
                  <img
                    alt="profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    src={`${BASE_URL}/api/users/image/${friend.profilePhoto}`}
                  />
                </Link>
                <h3 className="font-semibold ">{friend?.userName}</h3>
              </div>
              <button
                onClick={MakeVideoCall}
                className="cursor-pointer text-primary hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full"
              >
                <FaVideo size="20px" />
              </button>
            </header>
            <main className="relative">
              {messages.length === 0 && (
                <Empty
                  icon={<BsChatDotsFill />}
                  content={"No messages to display"}
                />
              )}
              <section className="p-2 sm:p-4" style={{ height: "58vh" }}>
                <Scrollbars ref={scrollbars}>
                  {messages.map((message) => {
                    const person =
                      message.sender === friend._id ? friend : user;
                    return (
                      <Message
                        key={message._id}
                        message={message}
                        person={person}
                        user={user}
                      />
                    );
                  })}
                  {typing && (
                    <div className="flex space-x-2 mb-3 items-center">
                      <img
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                        src={`${BASE_URL}/api/users/image/${friend.profilePhoto}`}
                      />
                      <div className="bg-white dark:bg-dark900  w-12 shadow-lg py-2 pl-5 pr-1 rounded">
                        <Typing />
                      </div>
                    </div>
                  )}
                </Scrollbars>
              </section>
              <footer className="shadow relative flex items-center">
                <div className="mx-1">
                  <button
                    type="button"
                    onClick={(_) => {
                      setOpenEmoji((prev) => !prev);
                    }}
                  >
                    <HiEmojiHappy color="orange" />
                  </button>
                </div>
                <div className="flex-1">
                  <PostField
                    onChanged={(val) => userTyping(val)}
                    val={message}
                    OnFileChanged={fileChanged}
                    onSubmit={sendMessageHandler}
                    imagePreview={imagePreview}
                    setImage={setImage}
                    setImagePreview={setImagePreview}
                    imageType={imageType}
                    onKeyUp={() => userNotTyping()}
                  >
                    <MdSend />
                  </PostField>
                </div>
                {openEmoji && (
                  <div className="absolute bottom-10 right-0 z-40">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </footer>
            </main>
          </>
        )}
      </section>
    </div>
  );
};

export default Chat;
