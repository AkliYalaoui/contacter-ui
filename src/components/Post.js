import moment from "moment";
import { FaTimes, FaTrash } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Comment from "./Comment";
import { Scrollbars } from "react-custom-scrollbars";
import PostField from "./PostField";
import { MdModeComment } from "react-icons/md";
import { useSocket } from "../context/SocketProvider";
import Alert from "./Alert";
import Empty from "./Empty";
import EmojiPicker from "./EmojiPicker";
import { HiEmojiHappy } from "react-icons/hi";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Post = ({
  post,
  preview,
  setLikes,
  setComments,
  onDelete,
  imagePreviewType,
}) => {
  const { user } = useAuth();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [liked, setLiked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState();
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageType, setImageType] = useState("image");
  const { socket } = useSocket();

  const onEmojiClick = (emoji) => {
    setComment((prev) => `${prev}${emoji}`);
  };

  const fileChanged = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageType(file.type.split("/")[0]);
    }
  };

  const deletePost = () => {
    fetch(`${BASE_URL}/api/posts/${post._id}`, {
      method: "DELETE",
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onDelete(post._id);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const likeUnlike = (_) => {
    setLiked((prev) => {
      return !prev;
    });

    if (liked) {
      setLikes(post._id, -1);
    } else {
      setLikes(post._id, 1);
    }

    fetch(`${BASE_URL}/api/likes/post/${post._id}`, {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.liked) {
            socket.emit("send-notification", data.notification.to, {
              ...data.notification,
              from: data.from,
            });
          }
        } else {
          console.log(data.error);
        }
        post.userId.friends.forEach((friend) => {
          socket.emit("send-like", friend, post._id, data.liked);
        });
        socket.emit("send-like", post.userId._id, post._id, data.liked);
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
          setLikes(post._id, data.countLikes);
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
    e.preventDefault();
    if (!image && !comment) {
      // setAlert("Can't create an empty comment");
      return;
    }
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
          setOpenEmoji(false);
          setImagePreview(null);
          setComments(post._id, { ...data.comment, userId: user });
          post.userId.friends.forEach((friend) => {
            socket.emit("send-comment", friend, post._id, {
              ...data.comment,
              userId: user,
            });
          });
          socket.emit("send-comment", post.userId._id, post._id, {
            ...data.comment,
            userId: user,
          });
          socket.emit("send-notification", data.notification.to, {
            ...data.notification,
            from: data.from,
          });
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
          setComments(post._id, data.comments, true);
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
      <header className="p-2 flex space-x-2 justify-between items-center border-b border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2 items-center">
          <img
            alt="profile"
            className="w-8 h-8 rounded-full object-contain"
            src={`${BASE_URL}/api/users/image/${post.userId.profilePhoto}`}
          />
          <div className="">
            <h3 className="font-bold text-sm -mb-2">{post.userId.userName}</h3>
            <span className="text-xs">
              {moment(new Date(post.createdAt)).fromNow()}
            </span>
          </div>
        </div>
        {post.userId._id === user.id && onDelete && (
          <button
            title="update this post"
            className="hover:opacity-80"
            onClick={deletePost}
          >
            <FaTrash />
          </button>
        )}
      </header>
      <main>
        <p className="p-2 mb-4  text-sm sm:text-md">{post.content}</p>
        <div className="border-b border-gray-300 dark:border-gray-600">
          {preview ? (
            imagePreviewType === "video" ? (
              <video
                src={preview}
                className="object-contain max-h-96 m-auto block w-full"
                controls
              ></video>
            ) : (
              <img
                className="object-contain max-h-96 m-auto block w-full"
                src={preview}
              />
            )
          ) : post.hasImage !== false ? (
            post.image.type === "video" ? (
              <video
                src={`${BASE_URL}/api/posts/image/${post.image.url}`}
                className="object-contain max-h-96 m-auto block w-full"
                controls
              ></video>
            ) : (
              <img
                className="object-contain max-h-96 m-auto block w-full"
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
                <span>{post.likes} likes</span>
                <button
                  className="hover:opacity-70 dark:hover:opacity-70"
                  onClick={likeUnlike}
                >
                  {liked ? <AiFillHeart color="red" /> : <AiFillHeart />}
                </button>
              </div>
              <div className="flex items-center space-x-2 ">
                <span>{post.comments?.length} comments</span>
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
              {post.comments?.length === 0 && (
                <Empty
                  content="No comments to display"
                  icon={<MdModeComment />}
                />
              )}
              {post.comments?.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })}
            </Scrollbars>
          </section>
          <footer className="relative flex items-center">
            <div className="mx-1">
              <button
                type="button"
                onClick={(_) => setOpenEmoji((prev) => !prev)}
              >
                <HiEmojiHappy color="orange" />
              </button>
            </div>
            <div className="flex-1">
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
            </div>
            {openEmoji && (
              <div className="absolute top-full right-0 z-20">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </footer>
        </aside>
      )}
    </article>
  );
};

export default Post;
