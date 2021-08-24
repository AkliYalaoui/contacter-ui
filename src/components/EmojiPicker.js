import { useRef, useEffect, createElement } from "react";
import "emoji-picker-element";

const EmojiPicker = ({ onEmojiClick }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.addEventListener("emoji-click", (event) => {
      onEmojiClick(event.detail.unicode);
    });
    ref.current.skinToneEmoji = "👍";
  }, []);

  return createElement("emoji-picker", {
    ref,
    class: document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
    style: { width: "320px" },
  });
};

export default EmojiPicker;
