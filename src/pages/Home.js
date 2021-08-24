import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import Post from "../components/Post";
import Error from "../components/Error";
import Empty from "../components/Empty";
import Loading from "../components/Loading";
import { ImSad } from "react-icons/im";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState();

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
        setPostsLoading(false);
        if (data.success) setPosts(data.posts);
        else setPostsError(data.error);
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
          <Post key={post._id} onDelete={deletePost} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Home;
