import { useAuth } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import Post from "../components/Post";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/posts/", {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data.posts);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="mb-10">
      <main className="mt-8">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Home;
