const VideoChat = ({ closeModal, myVideo, userVideo, callRunning }) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-white dark:bg-dark800">
      <button
        onClick={closeModal}
        className="bg-red-600 z-50 text-white rounded py-2 px-4 cursor-pointer fixed bottom-10 left-1/2 transform -translate-x-1/2"
      >
        End Call
      </button>
      <div className="fixed top-0 left-0 h-full w-full z-30 flex flex-wrap">
        {
          <video
            className="flex-1 object-cover"
            ref={userVideo}
            autoPlay
          ></video>
        }
        <video
          className="flex-1 object-cover"
          ref={myVideo}
          muted
          autoPlay
        ></video>
      </div>
    </div>
  );
};

export default VideoChat;
