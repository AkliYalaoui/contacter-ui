import { BsCardImage } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import FormInput from "./FormInput";

const PostField = ({
  OnFileChanged,
  onSubmit,
  setImage,
  setImagePreview,
  imagePreview,
  imageType,
  onChanged,
  val,
  children,
  onKeyUp,
}) => {
  return (
    <form onSubmit={(e) => onSubmit(e)} className="flex relative">
      {imagePreview && (
        <div className="absolute bottom-10 right-0 p-1 bg-white dark:bg-dark900 shadow-lg border border-gray-300 dark:border-gray-600">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-400 p-1 block ml-auto cursor-pointer"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
          >
            <FaTimes />
          </button>
          {imageType === "video" ? (
            <video
              src={imagePreview}
              className="object-cover w-28 h-28 m-auto"
              controls
            ></video>
          ) : (
            <img className="object-cover w-28 h-28 m-auto" src={imagePreview} />
          )}
        </div>
      )}
      <div className="justify-self-center px-2 self-center pl-1">
        <label htmlFor="commentUpload" type="button" className="cursor-pointer">
          <BsCardImage color="green" />
        </label>
        <input
          onChange={(e) => OnFileChanged(e)}
          id="commentUpload"
          type="file"
          className="sr-only"
          accept="image/*,video/*"
        />
      </div>
      <div className="-mx-2 flex-1 min-w-0">
        <FormInput
          onValueChanged={(v) => onChanged(v)}
          placeholder="type here"
          value={val}
          onKeyUp={onKeyUp}
          notRequired
        />
      </div>
      <button className="cursor-pointer border-l dark:border-gray-600 bg-primary  dark:bg-dark900 dark:text-primary text-white px-2 py-1">
        {children}
      </button>
    </form>
  );
};

export default PostField;
