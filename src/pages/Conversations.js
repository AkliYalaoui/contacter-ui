import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Conversation from "../components/Conversation";
import Empty from "../components/Empty";
import { BsChatDotsFill } from "react-icons/bs";
import Error from "../components/Error";

const Conversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationsError, setConversationsError] = useState();

  useEffect(() => {
    fetch("http://localhost:8080/api/conversations", {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConversations(data.conversations);
        else setConversationsError(data.error);
      })
      .catch((err) => {
        console.log(err);
        setConversationsError(
          "something went wrong while trying to get the conversations,please try again"
        );
      });
  }, [user.token]);

  return (
    <section className="mt-10">
      {conversationsError && <Error content={conversationsError} />}
      {conversations.length === 0 && (
        <Empty
          icon={<BsChatDotsFill />}
          content={"No conversations to display"}
        />
      )}
      {conversations.map((conversation) => (
        <Conversation key={conversation._id} conversation={conversation} />
      ))}
    </section>
  );
};

export default Conversations;
