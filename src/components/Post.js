import moment from "moment";
import { FaTimes } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Comment from "./Comment";
import { Scrollbars } from "react-custom-scrollbars";
import PostField from "./PostField";
import { MdModeComment } from "react-icons/md";
import { useSocket } from "../context/SocketProvider";
import Alert from "./Alert";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Post = ({ post, preview, imagePreviewType }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState();
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageType, setImageType] = useState("image");
  const { socket } = useSocket();

  useEffect(() => {
    socket?.emit("join-post", `post-${post._id}`);
  }, [socket]);

  useEffect(() => {
    const receiveComment = (id, c) => {
      setComments((prev) => [c, ...prev]);
      setCommentsCount((prev) => prev + 1);
    };
    socket?.on("receive-comment", receiveComment);
    return () => socket?.removeListener("receive-comment", receiveComment);
  }, [socket]);

  useEffect(() => {
    const receiveLike = (id, c) => {
      if (c) {
        setLikes((l) => l + 1);
      } else {
        setLikes((l) => l - 1);
      }
    };
    socket?.on("receive-like", receiveLike);
    return () => socket?.removeListener("receive-like", receiveLike);
  }, [socket]);

  const fileChanged = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageType(file.type.split("/")[0]);
    }
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

    fetch(`${BASE_URL}/api/likes/post/${post._id}`, {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          if (data.liked) {
            socket.emit(
              "join-notifications",
              `notifications-${data.notification.to}`
            );
            socket.emit(
              "send-notification",
              `notifications-${data.notification.to}`,
              {
                ...data.notification,
                from: data.from,
              }
            );
          }
        } else {
          console.log(data.error);
        }
        socket.emit("send-like", `post-${post._id}`, data.liked);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!post._id) return;

    fetch(`${BASE_URL}/api/likes/post/${post._id}`, {
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
    fetch(`${BASE_URL}/api/comments/post/${post._id}`, {
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
          socket.emit("send-comment", `post-${post._id}`, {
            ...data.comment,
            userId: user,
          });

          socket.emit(
            "join-notifications",
            `notifications-${data.notification.to}`
          );
          socket.emit(
            "send-notification",
            `notifications-${data.notification.to}`,
            {
              ...data.notification,
              from: data.from,
            }
          );
        } else {
          console.log(data.error);
          setAlert(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert("something went wrong,please try again");
      });
  };
  useEffect(() => {
    if (!post._id) return;

    fetch(`${BASE_URL}/api/comments/post/${post._id}`, {
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
    <article className="shadow-2xl border border-gray-300 dark:bg-dark800 dark:border-gray-600 mb-6 relative dark:text-white text-gray-600">
      {alert && (
        <Alert setOpen={setAlert}>
          <b className="capitalize">Error!</b> {alert}
        </Alert>
      )}
      <header className="p-2 flex space-x-2 items-center border-b border-gray-200 dark:border-gray-600">
        <img
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
          src={`${BASE_URL}/api/users/image/${post.userId.profilePhoto}`}
        />
        <div className="">
          <h3 className="font-bold text-sm -mb-2">{post.userId.userName}</h3>
          <span className="text-xs">
            {moment(new Date(post.createdAt)).fromNow()}
          </span>
        </div>
      </header>
      <main>
        <p className="p-2 mb-4  text-sm sm:text-md">{post.content}</p>
        <div className="border-b border-gray-300 dark:border-gray-600">
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
                src={`${BASE_URL}/api/posts/image/${post.image.url}`}
                className="object-cover max-h-96 m-auto block w-full"
                controls
              ></video>
            ) : (
              <img
                className="object-cover max-h-96 m-auto block w-full"
                src={`${BASE_URL}/api/posts/image/${post.image.url}`}
              />
            )
          ) : null}
        </div>
        <div className="p-3 flex items-center justify-evenly">
          {preview && (
            <>
              <div className="flex items-center space-x-2 ">
                <span>0 likes</span>
                <button className="hover:opacity-70 dark:hover:opacity-70">
                  <AiFillHeart />
                </button>
              </div>
              <div className="flex items-center space-x-2 ">
                <span>0 comments</span>
                <button className="hover:opacity-70 dark:hover:opacity-70">
                  <MdModeComment />
                </button>
              </div>
            </>
          )}
          {!preview && (
            <>
              <div className="flex items-center space-x-2 ">
                <span>{likes} likes</span>
                <button
                  className="hover:opacity-70 dark:hover:opacity-70"
                  onClick={likeUnlike}
                >
                  {liked ? <AiFillHeart color="red" /> : <AiFillHeart />}
                </button>
              </div>
              <div className="flex items-center space-x-2 ">
                <span>{commentsCount} comments</span>
                <button
                  className="hover:opacity-70 dark:hover:opacity-70"
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
        <aside className="absolute top-0 left-0 h-full w-full bg-white dark:bg-dark800 flex flex-col justify-between">
          <button
            className=" p-2 block ml-auto cursor-pointer"
            onClick={(_) => setOpenComments(false)}
          >
            <FaTimes />
          </button>
          <section className="flex-1 border-b border-gray-300 dark:border-gray-600">
            <Scrollbars>
              {comments.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })}
            </Scrollbars>
          </section>
          <footer>
            <PostField
              onChanged={setComment}
              val={comment}
              OnFileChanged={fileChanged}
              onSubmit={postComment}
              imagePreview={imagePreview}
              setImage={setImage}
              setImagePreview={setImagePreview}
              imageType={imageType}
            >
              <MdModeComment />
            </PostField>
          </footer>
        </aside>
      )}
    </article>
  );
};

export default Post;
