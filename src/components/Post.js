import moment from "moment";
import { FaTimes } from "react-icons/fa";
import { MdModeComment } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import FormInput from "../components/FormInput";
import { Scrollbars } from "react-custom-scrollbars";

const Post = ({ post, preview, imagePreviewType }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageType, setImageType] = useState("image");

  const fileChanged = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageType(file.type.split("/")[0]);
  };

  const likeUnlike = (_) => {
    setLiked((prev) => {
      if (prev) {
        setLikes((l) => l - 1);
      } else {
        setLikes((l) => l + 1);
      }
      return !prev;
    });

    fetch(`http://localhost:8080/api/likes/post/${post._id}`, {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!post._id) return;

    fetch(`http://localhost:8080/api/likes/post/${post._id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikes(data.countLikes);
          setLiked(data.alreadyLiked);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [post._id]);

  const postComment = (e) => {
    if (comment.trim().length === 0) return;
    e.preventDefault();
    const body = new FormData();
    body.append("content", comment);
    if (image) {
      body.append("commentPhoto", image);
    }
    fetch(`http://localhost:8080/api/comments/post/${post._id}`, {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComment("");
          setImage(null);
          setImagePreview(null);
          setCommentsCount((prev) => prev + 1);
          setComments((prev) => [{ ...data.comment, userId: user }, ...prev]);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (!post._id) return;

    fetch(`http://localhost:8080/api/comments/post/${post._id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments);
          setCommentsCount(data.comments.length);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [post._id]);

  return (
    <article className="shadow-2xl border border-gray-300 mb-6 relative">
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
          ) : post.hasImage !== false ? (
            post.image.type === "video" ? (
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
            )
          ) : null}
        </div>
        <div className="p-3 flex items-center justify-evenly">
          {preview && (
            <>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>0 likes</span>
                <button className="hover:opacity-70">
                  <AiFillHeart />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>0 comments</span>
                <button className="hover:opacity-70">
                  <MdModeComment />
                </button>
              </div>
            </>
          )}
          {!preview && (
            <>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{likes} likes</span>
                <button className="hover:opacity-70" onClick={likeUnlike}>
                  {liked ? <AiFillHeart color="red" /> : <AiFillHeart />}
                </button>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{commentsCount} comments</span>
                <button
                  className="hover:opacity-70"
                  onClick={(_) => setOpenComments(true)}
                >
                  <MdModeComment />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      {openComments && (
        <aside className="absolute top-0 left-0 h-full w-full bg-white flex flex-col justify-between">
          <button
            className="text-gray-500 p-2 block ml-auto cursor-pointer"
            onClick={(_) => setOpenComments(false)}
          >
            <FaTimes />
          </button>
          <section className="flex-1 border-b border-gray-300">
            <Scrollbars>
              {comments.map((comment) => {
                return (
                  <div
                    key={comment._id}
                    className="p-2 flex items-start text-gray-600 text-sm"
                  >
                    <img
                      alt="profile"
                      className="w-8 h-8 object-cover rounded-full"
                      src={`http://localhost:8080/api/users/image/${comment.userId?.profilePhoto}`}
                    />
                    <div className="ml-2">
                      <p className="bg-gray-200 mb-2  px-1 shadow rounded-md">
                        {comment.content}
                      </p>
                      {comment.hasImage &&
                        (comment.image.type === "video" ? (
                          <video
                            src={`http://localhost:8080/api/comments/image/${comment.image.url}`}
                            className="object-cover w-28 h-28 m-auto"
                            controls
                          ></video>
                        ) : (
                          <img
                            className="object-cover w-28 h-28 m-auto"
                            src={`http://localhost:8080/api/comments/image/${comment.image.url}`}
                          />
                        ))}
                      <span className="text-xs  px-1 text-gray-400">
                        {moment(new Date(comment.createdAt)).fromNow()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </Scrollbars>
          </section>
          <footer>
            <form onSubmit={postComment} className="flex relative">
              {imagePreview && (
                <div className="absolute bottom-10 right-0 p-1 bg-white shadow-lg border border-gray-300">
                  <button
                    className="text-gray-500 p-1 block ml-auto cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <FaTimes />
                  </button>
                  {imageType === "video" ? (
                    <video
                      src={imagePreview}
                      className="object-cover w-28 h-28 m-auto"
                      controls
                    ></video>
                  ) : (
                    <img
                      className="object-cover w-28 h-28 m-auto"
                      src={imagePreview}
                    />
                  )}
                </div>
              )}
              <div className="justify-self-center self-center pl-1">
                <label
                  htmlFor="commentUpload"
                  type="button"
                  className="cursor-pointer"
                >
                  <BsCardImage color="green" />
                </label>
                <input
                  onChange={(e) => fileChanged(e)}
                  id="commentUpload"
                  type="file"
                  className="sr-only"
                  accept="image/*,video/*"
                />
              </div>
              <div className="-mx-2 flex-1 min-w-0">
                <FormInput
                  onValueChanged={(val) => setComment(val)}
                  placeholder="type your comment here"
                  value={comment}
                />
              </div>
              <button className="cursor-pointer bg-primary text-white px-2 py-1">
                <MdModeComment />
              </button>
            </form>
          </footer>
        </aside>
      )}
    </article>
  );
};

export default Post;
