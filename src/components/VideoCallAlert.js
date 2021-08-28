import { useRef, useEffect } from "react";
import { BiPhoneCall } from "react-icons/bi";
import { FiPhoneOff } from "react-icons/fi";
import vibration from "../assets/videocall.mp3";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const VideoCallAlert = ({ onAnswer, onCancel, call }) => {
  const btn = useRef();
  const audio = useRef();
  useEffect(() => {
    setTimeout(() => {
      btn.current?.click();
      audio.current?.pause();
      audio.current && (audio.current.currentTime = 0);
    }, 30000);
  }, []);

  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 bg-white text-gray-600 dark:text-white dark:bg-dark800 p-2 shadow-lg w-60">
      <div className="flex items-start">
        <img
          alt="profile"
          className="object-contain w-8 h-8 mr-1 rounded-full"
          src={`${BASE_URL}/api/users/image/${call.profilePhoto}`}
        />
        <p className="dark:bg-dark900 dark:text-white p-1 rounded">
          {call.name} is calling ...
        </p>
      </div>
      <div className="flex justify-center flex-wrap mt-2">
        <button
          className="bg-primary mr-1 text-white cursor-pointer p-3 rounded-full"
          onClick={() => {
            onAnswer();
            audio.current?.pause();
            audio.current && (audio.current.currentTime = 0);
          }}
        >
          <BiPhoneCall />
        </button>
        <button
          ref={btn}
          className="bg-red-600 text-white cursor-pointer p-3 rounded-full"
          onClick={() => {
            onCancel();
            audio.current?.pause();
            audio.current && (audio.current.currentTime = 0);
          }}
        >
          <FiPhoneOff />
        </button>
      </div>
      <audio
        className="sr-only"
        autoPlay={true}
        controls={true}
        loop={true}
        ref={audio}
      >
        <source type="audio/mp3" src={vibration} />
      </audio>
    </div>
  );
};

export default VideoCallAlert;
