import Conversation from "../components/Conversation";
import Empty from "../components/Empty";
import { BsChatDotsFill } from "react-icons/bs";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { useOnlineUsers } from "../context/ConversationProvider";

const Conversations = () => {
  const {
    onlineUsers,
    conversations,
    conversationsError,
    conversationsLoading,
  } = useOnlineUsers();

  if (conversationsLoading) {
    return <Loading />;
  }

  return (
    <section className="mt-10">
      {/* {onlineUsers.length === 0 && (
        <div className="mb-8 bg-gray-200 p-2 rounded dark:bg-dark800 text-center text-gray-600 dark:text-white">
          None of your friends is online
        </div>
      )}
      <div>
        {onlineUsers.map((u) => (
          <div key={u.id}>
            <h4>{u.userName}</h4>
          </div>
        ))}
      </div> */}
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
