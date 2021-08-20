const Suggestion = ({ person, onAddFriend }) => {
  return (
    <div className="bg-gray-200 dark:bg-dark800 text-gray-600 dark:text-white rounded py-2 px-4 shadow-lg max-w-xs m-auto mb-4">
      <div className="font-bold  text-right text-xs">
        {person.friends.length} Friends
      </div>
      <div className="flex space-x-3 items-start">
        <img
          alt="profile"
          className="w-12 cursor-pointer h-12 rounded-full"
          src={`http://localhost:8080/api/users/image/${person.profilePhoto}`}
        />
        <div className="flex-1">
          <h3 className=" mb-1 font-bold">{person.userName}</h3>
          <p className="text-xs">{person.about.slice(0, 100)}</p>
          <div className="flex items-center space-x-3 mt-2">
            <button
              onClick={() => onAddFriend(person._id)}
              className="py-1 px-2 text-white  ml-auto bg-primary rounded shadow"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
