import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import Empty from "../components/Empty";
import { BsChatDotsFill } from "react-icons/bs";
import Error from "../components/Error";
import { useParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { MdSend } from "react-icons/md";
import io from "socket.io-client";
import { FaVideo } from "react-icons/fa";

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
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
    return () => socket?.close();
  }, []);

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
    fetch(`http://localhost:8080/api/conversations/${id}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify({ msg: message }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages((prev) => [...prev, data.message]);
          socket.emit("send-message", id, data.message);
          scrollbars.current.scrollToBottom();
          setMessage("");
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
      <section className="bg-gray-100 shadow">
        {friend && (
          <>
            <header className="py-1 sm:py-2 px-4 justify-between flex items-center shadow">
              <div className="space-x-4 flex items-start">
                <img
                  alt="profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  src={`http://localhost:8080/api/users/image/${friend.profilePhoto}`}
                />
                <h3 className="font-semibold text-gray-600">
                  {friend?.userName}
                </h3>
              </div>
              <button className="cursor-pointer text-primary hover:bg-gray-300 p-2 rounded-full">
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
                      <div
                        key={message._id}
                        className={`flex space-x-2 mb-3 items-center ${
                          message.sender === user.id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <img
                          alt="profile"
                          className="w-8 h-8 rounded-full"
                          src={`http://localhost:8080/api/users/image/${person.profilePhoto}`}
                        />
                        <p className="bg-white shadow py-1 px-2 rounded w-max">
                          {message.content}
                        </p>
                      </div>
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
                <form onSubmit={sendMessageHandler} className="flex">
                  <div className="-mx-2 flex-1 min-w-0">
                    <FormInput
                      onValueChanged={(val) => userTyping(val)}
                      onKeyUp={() => userNotTyping()}
                      placeholder="type your message here"
                      value={message}
                    />
                  </div>
                  <Button classes={"bg-primary rounded-none"}>
                    <MdSend />
                  </Button>
                </form>
              </footer>
            </main>
          </>
        )}
      </section>
    </div>
  );
};

export default Chat;
