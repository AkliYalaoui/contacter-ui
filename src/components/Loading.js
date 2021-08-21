import Typing from "./Typing";

const Loading = () => {
  return (
    <div className="text-gray-600 my-3 text-center dark:text-white flex items-center justify-center">
      <div className="mr-8">Please wait. It's loading </div>
      <Typing/>
    </div>
  );
};

export default Loading;
