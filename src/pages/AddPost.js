import { useAuth } from "../context/AuthProvider";
import { MdPublic, MdPublish } from "react-icons/md";
import TextArea from "../components/TextArea";
import { useState } from "react";
import Picker from "emoji-picker-react";
import { HiEmojiHappy } from "react-icons/hi";
import { BsCardImage } from "react-icons/bs";
import Post from "../components/Post";
import Button from "../components/Button";
import Error from "../components/Error";

const AddPost = () => {
  const { user } = useAuth();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [postError, setPostError] = useState("");
  const [imagePreview, setImagePreview] = useState("a");
  const [imagePreviewType, setImagePreviewType] = useState("image");
  const [preview] = useState(true);

  const [postPreview, setPostPreview] = useState({
    userId: user,
    createdAt: new Date(),
    content: "",
  });

  const onEmojiClick = (event, emojiObject) => {
    setContent((prev) => `${prev}${emojiObject.emoji}`);
  };
  const fileChanged = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImagePreviewType(file.type.split("/")[0]);
  };

  const onPostHandler = (e) => {
    e.preventDefault();

    const body = new FormData();
    body.append("content", content);
    if (image) {
      body.append("postPhoto", image);
    }

    //Post to our api
    fetch("http://localhost:8080/api/posts/create", {
      method: "POST",
      headers: {
        "auth-token": user.token,
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("data");
        } else {
          console.log(data.erro);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      {postError && <Error content={postError} />}
      <section className="p-4 shadow-2xl border border-gray-300 mt-6 relative">
        <header className="flex items-center">
          <div className="flex items-center">
            <img
              alt="profile"
              className="w-10 h-10 rounded-full mr-4"
              src={`http://localhost:8080/api/users/image/${user.profilePhoto}`}
            />
            <div className="text-gray-600">
              <span className="font-semibold">{user.userName}</span>
              <MdPublic />
            </div>
          </div>
        </header>
        <form onSubmit={onPostHandler}>
          <TextArea
            placeholder={`What's on your mind, ${user.userName}?`}
            value={content}
            onValueChanged={(val) => {
              setContent(val);
              setPostPreview({
                userId: user,
                createdAt: new Date(),
                content: val,
                likes: [],
                comments: [],
              });
            }}
          />
          <footer className="flex justify-evenly items-center text-gray-500 pt-2">
            <div>
              <label
                htmlFor="imageUpload"
                type="button"
                className="flex items-center space-x-3 cursor-pointer hover:text-primary"
              >
                <BsCardImage color="green" />
                <span>image</span>
              </label>
              <input
                onChange={(e) => fileChanged(e)}
                id="imageUpload"
                type="file"
                className="sr-only"
                accept="image/*,video/*"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={(_) => setOpenEmoji((prev) => !prev)}
                className="flex items-center space-x-3 hover:text-primary"
              >
                <HiEmojiHappy color="orange" /> <span>emoji</span>
              </button>
              {openEmoji && (
                <div className="absolute top-12 right-0 z-20">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </footer>
          <div className="absolute top-0 right-0" title="post">
            <Button classes="bg-primary">
              <MdPublish />
            </Button>
          </div>
        </form>
      </section>
      <section className="mt-10">
        <h2 className="pb-2 mb-4 border-b border-gray-700 text-gray-700 font-semibold">
          # Preview
        </h2>
        {preview && (
          <Post
            post={postPreview}
            preview={imagePreview}
            imagePreviewType={imagePreviewType}
          />
        )}
      </section>
    </div>
  );
};

export default AddPost;
