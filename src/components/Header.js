import logo from "../assets/logo.png";
import FormInput from "./FormInput";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { MdEdit } from "react-icons/md";
import Menu from "./Menu";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Header = () => {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState([]);

  const search = (needle) => {
    if (!needle.trim()) {
      setData([]);
      return;
    }

    fetch(`${BASE_URL}/api/users/${needle.trim()}`, {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.results);
        } else {
          console.log(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonContent = (
    <img
      alt="profile"
      className="w-10 cursor-pointer object-contain h-10 rounded-full"
      src={`${BASE_URL}/api/users/image/${user.profilePhoto}`}
    />
  );
  const menuItems = [
    <>
      <CgProfile />
      <Link to={`/profile/${user.id}`}>Profile</Link>
    </>,
    <>
      <MdEdit />
      <Link to="/edit-profile">Edit</Link>
    </>,
    <button
      onClick={(_) => updateUser(null)}
      className="flex items-center space-x-2 text-gray-600 dark:text-white hover:text-primary transition hover:border-primary dark:hover:border-primary dark:hover:text-primary"
    >
      <CgLogOut />
      <span>Logout</span>
    </button>,
  ];

  return (
    <header className="flex items-center justify-evenly space-x-4 shadow-lg p-2 sm:px-8">
      <div className="hidden sm:block">
        <Link to="/home">
          <img src={logo} alt="logo" className="w-36 h-8 object-cover" />
        </Link>
      </div>
      <form className="w-full max-w-xs min-w-0 relative">
        <FormInput
          type={"text"}
          placeholder="search"
          onValueChanged={(val) => search(val)}
        >
          <FaSearch />
        </FormInput>
        {data.length > 0 && (
          <div className="absolute shadow-lg  top-12 right-0 w-full h-72 bg-white dark:bg-dark800 z-30 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white">
            <Scrollbars>
              {data.map((res) => (
                <Link key={res._id} to={`/profile/${res._id}`}>
                  <div className="p-2 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-dark900">
                    {res.userName}
                  </div>
                </Link>
              ))}
            </Scrollbars>
          </div>
        )}
      </form>
      <Menu buttonContent={buttonContent} menuItems={menuItems} />
    </header>
  );
};

export default Header;
