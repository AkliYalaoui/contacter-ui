import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Conversation from "../components/Conversation";
import Empty from "../components/Empty";
import { BsChatDotsFill } from "react-icons/bs";
import Error from "../components/Error";
import Loading from "../components/Loading";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Conversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationsError, setConversationsError] = useState();
  const [conversationsLoading, setConversationsLoading] = useState(false);
  
  useEffect(() => {
    setConversationsLoading(true);
    fetch(`${BASE_URL}/api/conversations`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversationsLoading(false);
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
  if (conversationsLoading) {
    return <Loading />;
  }

  return (
    <section className="mt-10">
      {conversationsError && (
        <Error setOpen={conversationsError} content={conversationsError} />
      )}
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
