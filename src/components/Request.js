import moment from "moment";

const Request = ({ person, onConfirmRequest, onDeleteRequest }) => {
  return (
    <div className="bg-gray-200 rounded py-2 px-4 shadow-lg max-w-xs m-auto mb-4">
      <div className="font-bold text-gray-500 text-right text-xs">
        {moment(new Date(person.createdAt)).fromNow()}
      </div>
      <div className="flex space-x-3 items-start">
        <img
          alt="profile"
          className="w-14 cursor-pointer h-14 rounded-full"
          src={`http://localhost:8080/api/users/image/${person.requester.profilePhoto}`}
        />
        <div className="flex-1">
          <h3 className="text-gray-800 font-bold">
            {person.requester.userName}
          </h3>
          <p className="text-gray-600 text-xs">
            {person.requester.about.slice(0, 100)}
          </p>
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => onConfirmRequest(person._id)}
              className="py-1 px-2 text-white bg-primary rounded shadow"
            >
              Confirm
            </button>
            <button
              onClick={() => onDeleteRequest(person._id)}
              className="py-1 px-2 text-gray-600 bg-gray-300 rounded shadow"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
