import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import Post from "../components/Post";
import Error from "../components/Error";
import Empty from "../components/Empty";
import Loading from "../components/Loading";
import { ImSad } from "react-icons/im";
import { useSocket } from "../context/SocketProvider";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState();
  const { socket } = useSocket();

  const setComments = (id, comment,setC = false) => {
    setPosts((prev) => {
      let i = 0;
      let element;
      for (let index = 0; index < prev.length; index++) {
        element = { ...prev[index] };
        if (element._id === id) {
          i = index;
          break;
        }
      }

      const tmp = [...prev];
      if (setC) {
        tmp[i] = { ...element, comments: comment };
      } else {
        tmp[i] = { ...element, comments: [comment, ...element.comments] };
      }

      return [...tmp];
    });
  };
  const setLikes = (id, count) => {
    setPosts((prev) => {
      let i = 0;
      let element;
      for (let index = 0; index < prev.length; index++) {
        element = { ...prev[index] };
        if (element._id === id) {
          i = index;
          break;
        }
      }

      const tmp = [...prev];
      tmp[i] = { ...element, likes: element.likes + count };

      return [...tmp];
    });
  };

  useEffect(() => {
    const receiveLike = (postId, c) => {
      if (c) setLikes(postId, 1);
      else setLikes(postId, -1);
    };
    socket?.on("receive-like", receiveLike);
    return () => socket?.removeListener("receive-like", receiveLike);
  }, [socket]);

  useEffect(() => {
    const receiveComment = (postId, comment) => {
      setComments(postId, comment);
    };
    socket?.on("receive-comment", receiveComment);
    return () => socket?.removeListener("receive-comment", receiveComment);
  }, [socket]);

  const deletePost = (id) => {
    setPosts((prev) =>
      prev.filter((post) => {
        return post._id !== id;
      })
    );
  };

  useEffect(() => {
    setPostsLoading(true);
    fetch(`${BASE_URL}/api/posts/`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.posts);
        if (data.success)
          setPosts(() =>
            data.posts.map((post) => ({ ...post, likes: 0, comments: [] }))
          );
        else setPostsError(data.error);
        setPostsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setPostsError("something went wrong, please try again");
      });
  }, []);

  if (postsLoading) {
    return <Loading />;
  }
  return (
    <div className="mb-10">
      <main className="mt-8">
        {postsError && <Error content={postsError} setOpen={setPostsError} />}
        {posts.length === 0 && (
          <Empty icon={<ImSad />} content={"No posts to display"} />
        )}
        {posts.map((post) => (
          <Post
            key={post._id}
            onDelete={deletePost}
            post={post}
            setLikes={setLikes}
            setComments={setComments}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;
