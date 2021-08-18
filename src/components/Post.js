import moment from "moment";
import { GoComment } from "react-icons/go";
import { AiOutlineHeart } from "react-icons/ai";

const Post = ({ post, preview, imagePreviewType }) => {
  return (
    <article className="shadow-2xl border border-gray-300 mb-6">
      <header className="p-2 flex space-x-2 items-center border-b border-gray-200">
        <img
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
          src={`http://localhost:8080/api/users/image/${post.userId.profilePhoto}`}
        />
        <div className="text-gray-600">
          <h3 className="font-bold text-sm -mb-2">{post.userId.userName}</h3>
          <span className="text-xs">
            {moment(new Date(post.createdAt)).fromNow()}
          </span>
        </div>
      </header>
      <main>
        <p className="p-2 mb-4 text-gray-700 text-sm sm:text-md">
          {post.content}
        </p>
        <div className="border-b border-gray-300">
          {preview ? (
            imagePreviewType === "video" ? (
              <video
                src={preview}
                className="object-cover max-h-96 m-auto block w-full"
                controls
              ></video>
            ) : (
              <img
                className="object-cover max-h-96 m-auto block w-full"
                src={preview}
              />
            )
          ) : post.image.type === "video" ? (
            <video
              src={`http://localhost:8080/api/posts/image/${post.image.url}`}
              className="object-cover max-h-96 m-auto block w-full"
              controls
            ></video>
          ) : (
            <img
              className="object-cover max-h-96 m-auto block w-full"
              src={`http://localhost:8080/api/posts/image/${post.image.url}`}
            />
          )}
        </div>
        <div className="p-3 flex items-center justify-evenly">
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{post.likes.length} likes</span>
            <button className="hover:text-primary">
              <AiOutlineHeart />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>{post.comments.length} comments</span>
            <button className="hover:text-primary">
              <GoComment />
            </button>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Post;
