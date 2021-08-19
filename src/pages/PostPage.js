import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState();

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          setPost(data.post);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, user.token]);

  return <div className="my-10">{post && <Post post={post} />}</div>;
};

export default PostPage;
