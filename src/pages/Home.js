import { useAuth } from "../context/AuthProvider";
import { MdPublic } from "react-icons/md";
import TextArea from "../components/TextArea";
import { useState } from "react";
import Picker from "emoji-picker-react";
import { HiEmojiHappy } from "react-icons/hi";
import { BsCardImage } from "react-icons/bs";

const Home = () => {
  const { user } = useAuth();
  const [openEmoji, setOpenEmoji] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
  };

  return (
    <div>
      <section className="p-4 shadow-2xl border border-gray-300 mt-6">
        <header className="flex items-center">
          <img
            alt="profile"
            className="w-10 h-10 rounded-full mr-4"
            src={`http://localhost:8080/api/users/image/${user.profilePhoto}`}
          />
          <div className="text-gray-600">
            <span className="font-semibold">{user.userName}</span>
            <MdPublic />
          </div>
        </header>
        <form>
          <TextArea
            placeholder={`What's on your mind, ${user.userName}?`}
            onValueChanged={(val) => console.log(val)}
          />
          <footer className="flex justify-evenly items-center text-gray-500 pt-2">
            <div>
              <button type="button" className="flex items-center space-x-3">
                <BsCardImage color="green" />
                <span>image</span>
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={(_) => setOpenEmoji((prev) => !prev)}
                className="flex items-center space-x-3"
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
        </form>
      </section>
    </div>
  );
};

export default Home;
