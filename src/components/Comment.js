import moment from "moment";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Comment = ({ comment }) => {
  return (
    <div className="px-2 mb-4 flex items-start text-gray-600 dark:text-white text-sm">
      <img
        alt="profile"
        className="w-8 h-8 object-cover rounded-full"
        src={`${BASE_URL}/api/users/image/${comment.userId?.profilePhoto}`}
      />
      <div className="ml-2">
        <p className="bg-gray-200 dark:bg-dark900 mb-2  px-1 shadow rounded-md">
          {comment.content}
        </p>
        {comment.hasImage &&
          (comment.image.type === "video" ? (
            <video
              src={`${BASE_URL}/api/comments/image/${comment.image.url}`}
              className="object-contain w-28 h-28 m-auto"
              controls
            ></video>
          ) : (
            <img
              className="object-contain w-28 h-28 m-auto"
              src={`${BASE_URL}/api/comments/image/${comment.image.url}`}
            />
          ))}
        <span className="text-xs  px-1 text-gray-400">
          {moment(new Date(comment.createdAt)).fromNow()}
        </span>
      </div>
    </div>
  );
};

export default Comment;
