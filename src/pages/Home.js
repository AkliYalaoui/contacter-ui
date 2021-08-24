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

  const setLikes = (id, count) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id === id) {
          console.log({ likes: p.likes, incr: count });
          p.likes += count;
        }
        return p;
      })
    );
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
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            console.log(postId, comment);
          }
          return p;
        })
      );
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
          setPosts(() => data.posts.map((post) => ({ ...post, likes: 0 })));
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
          />
        ))}
      </main>
    </div>
  );
};

export default Home;
