import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useParams } from "react-router-dom";
import Post from "../components/Post";
import Empty from "../components/Empty";
import { GiEmptyChessboard } from "react-icons/gi";
import { Scrollbars } from "react-custom-scrollbars";

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState();
  const [person, setPerson] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/get-user-info/${id}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserProfile({
            ...data.user,
            posts: data.posts,
          });
          setPerson(data.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!userProfile || !person) return <div>Loading...</div>;
  return (
    <div className="my-10 relative text-gray-600 dark:text-white">
      <header className="shadow-2xl border border-gray-100 dark:border-gray-600 rounded">
        <img
          alt="profile"
          className="w-full h-44 object-cover rounded"
          src={`http://localhost:8080/api/users/image/${userProfile.profilePhoto}`}
        />
      </header>
      <section className=" flex flex-wrap items-center justify-center">
        <img
          alt="profile"
          className="w-36 h-36 rounded-full object-cover shadow-inner border border-primary transform -translate-y-8 p-1"
          src={`http://localhost:8080/api/users/image/${userProfile.profilePhoto}`}
        />
        <div className="p-3 text-center">
          <h4 className="font-bold">About</h4>
          <p className="mb-4">{userProfile.about}</p>
          <div className="flex flex-row justify-center items-center space-x-2">
            <div className="space-x-2">
              <span>Friends</span>
              <span className="font-bold">
                {userProfile.friends.length}
              </span>
            </div>
            <div className="space-x-2">
              <span>Posts</span>
              <span className=" font-bold">{userProfile.posts.length}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6">
        <h2 className="pb-2 mb-4 border-b border-gray-600  font-semibold">
          # Friends
        </h2>
        <Scrollbars style={{ height: "300px" }}>
          <div className="flex flex-wrap space-x-1 items-center justify-center px-2 py-6">
            {userProfile.friends.map((friend) => (
              <Link key={friend._id} to={`/profile/${friend._id}`}>
                <div className="rounded border w-32  border-gray-300 dark:border-gray-600 shadow-lg text-center">
                  <img
                    alt="profile"
                    className="w-32 h-32 object-cover m-auto"
                    src={`http://localhost:8080/api/users/image/${friend.profilePhoto}`}
                  />
                  <h3 className="p-2">{friend.userName}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Scrollbars>
      </section>
      <section className="mt-6">
        <h2 className="pb-2 mb-4 border-b border-gray-600 font-semibold">
          ## Posts
        </h2>
        {userProfile.posts.length === 0 && (
          <Empty content={"No posts to display"} icon={<GiEmptyChessboard />} />
        )}
        <div>
          {userProfile.posts.map((post) => {
            return <Post key={post._id} post={{ ...post, userId: person }} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default Profile;
