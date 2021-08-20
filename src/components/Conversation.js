import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import moment from "moment";
import { Link } from "react-router-dom";

const Conversation = ({ conversation }) => {
  const { user } = useAuth();
  const [friend] = useState(() => {
    if (conversation.member_b._id === user.id) return conversation.member_a;
    return conversation.member_b;
  });
  return (
    <Link to={`/conversations/${conversation._id}`}>
      <div className=" bg-gray-100 text-gray-600 dark:text-white dark:bg-dark800 flex items-start space-x-2 p-2 rounded border-b border-gray-300 dark:border-gray-600">
        <img
          alt="profile"
          className="w-14 h-14 rounded-full"
          src={`http://localhost:8080/api/users/image/${friend.profilePhoto}`}
        />
        <div>
          <h3 className="font-bold ">{friend.userName}</h3>
          <p className="text-sm">
            {conversation.lastMessage
              ? conversation.lastMessage?.content?.length > 30
                ? conversation.lastMessage?.content?.slice(0, 30) + "..."
                : conversation.lastMessage?.content
              : "You are both friends now"}
          </p>
          <span className="text-xs">
            {moment(new Date(conversation.updatedAt)).fromNow()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Conversation;
