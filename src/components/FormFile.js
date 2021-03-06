import React from "react";

const FormFile = ({ label,onValueChanged }) => {
  return (
    <div className="flex-1 flex flex-col relative px-2">
      <label className="text-gray-600 capitalize">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-center text-gray-600">
            <label htmlFor="fileUpload" className="cursor-pointer text-primary hover:underline">
              <span>Upload a file</span>
            </label>
            <input onChange={e=> onValueChanged(e.target.files[0])} id="fileUpload" type="file" className="sr-only" />
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FormFile;
