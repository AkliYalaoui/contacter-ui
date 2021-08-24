import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useParams } from "react-router-dom";
import Post from "../components/Post";
import Empty from "../components/Empty";
import { GiEmptyChessboard } from "react-icons/gi";
import { Scrollbars } from "react-custom-scrollbars";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { ImSad } from "react-icons/im";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState();
  const [person, setPerson] = useState();
  const { id } = useParams();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const deletePost = (id) => {
    setUserProfile((prev) => {
      return {
        ...prev,
        posts: prev.posts.filter((post) => {
          return post._id !== id;
        }),
      };
    });
  };

  useEffect(() => {
    setProfileLoading(true);
    fetch(`${BASE_URL}/api/users/get-user-info/${id}`, {
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
        } else {
          setProfileError(data.error);
        }
        setProfileLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setProfileError("something went wrong, please try again");
      });
  }, [id]);

  if (profileLoading || !userProfile || !person) return <Loading />;
  return (
    <div className="my-10 py-10 relative text-gray-600 dark:text-white">
      {profileError && (
        <Error content={profileError} setOpen={setProfileError} />
      )}
      <header className="shadow-2xl border border-gray-100 dark:border-gray-600 rounded">
        <img
          alt="profile"
          className="w-full h-44 object-cover rounded"
          src={`${BASE_URL}/api/users/image/${userProfile.profilePhoto}`}
        />
      </header>
      <section className=" flex flex-wrap items-center justify-center">
        <img
          alt="profile"
          className="w-36 h-36 rounded-full object-cover shadow-inner border border-primary transform -translate-y-8 p-1"
          src={`${BASE_URL}/api/users/image/${userProfile.profilePhoto}`}
        />
        <div className="p-3 text-center">
          <h4 className="font-bold">About</h4>
          <p className="mb-4">{userProfile.about}</p>
          <div className="flex flex-row justify-center items-center space-x-2">
            <div className="space-x-2">
              <span>Friends</span>
              <span className="font-bold">{userProfile.friends.length}</span>
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
        {userProfile.friends.length === 0 && (
          <Empty content="no friends to display" icon={<ImSad />} />
        )}
        <Scrollbars style={{ height: "300px" }}>
          <div className="flex flex-wrap space-x-1 items-center justify-center px-2 py-6">
            {userProfile.friends.map((friend) => (
              <Link key={friend._id} to={`/profile/${friend._id}`}>
                <div className="rounded border w-32  border-gray-300 dark:border-gray-600 shadow-lg text-center">
                  <img
                    alt="profile"
                    className="w-32 h-32 object-cover m-auto"
                    src={`${BASE_URL}/api/users/image/${friend.profilePhoto}`}
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
            return (
              <Post
                key={post._id}
                onDelete={deletePost}
                post={{ ...post, userId: person }}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Profile;
