import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
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

const Chat = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [mounted, setMounted] = useState(false);
  const scrollbars = useRef();
  const [friend, setFriend] = useState();
  const [messagesError, setMessagesError] = useState();
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState("");
  const { socket } = useSocket();
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageType, setImageType] = useState("image");

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
    }, 500);
  };
  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const body = new FormData();
    body.append("content", message);
    if (image) {
      body.append("messagePhoto", image);
    }

    fetch(`http://localhost:8080/api/conversations/${id}`, {
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
    fetch(`http://localhost:8080/api/conversations/${id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
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

  return (
    <div className="mt-4">
      {messagesError && <Error content={messagesError} />}
      <section className="bg-gray-100 dark:bg-dark800 shadow text-gray-600 dark:text-white">
        {friend && (
          <>
            <header className="py-1 sm:py-2 px-4 justify-between flex items-center shadow">
              <div className="space-x-4 flex items-start">
                <Link to={`/profile/${friend._id}`}>
                  <img
                    alt="profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    src={`http://localhost:8080/api/users/image/${friend.profilePhoto}`}
                  />
                </Link>
                <h3 className="font-semibold ">{friend?.userName}</h3>
              </div>
              <button className="cursor-pointer text-primary hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full">
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
                        src={`http://localhost:8080/api/users/image/${friend.profilePhoto}`}
                      />
                      <p className="bg-white shadow py-1 px-2 rounded w-max animate-pulse">
                        {typing}
                      </p>
                    </div>
                  )}
                </Scrollbars>
              </section>
              <footer className="shadow">
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
              </footer>
            </main>
          </>
        )}
      </section>
    </div>
  );
};

export default Chat;
