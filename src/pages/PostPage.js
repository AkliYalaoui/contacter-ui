import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Loading from "../components/Loading";
import Error from "../components/Error";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState();
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    setPostLoading(true);
    fetch(`${BASE_URL}/api/posts/${id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostLoading(false);
        if (data.success) {
          console.log(data);
          setPost(data.post);
        } else {
          console.log(data.error);
          setPostError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setPostError("something went wrong, please try again");
      });
  }, [id, user.token]);

  if (postLoading) return <Loading />;

  return (
    <div className="my-10">
      {postError && <Error content={postError} setOpen={setPostError} />}
      {post && <Post post={post} />}
    </div>
  );
};

export default PostPage;
