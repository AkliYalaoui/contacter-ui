import logo from "../assets/logo.png";
import FormInput from "./FormInput";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { MdEdit } from "react-icons/md";
import Menu from "./Menu";

const Header = () => {
  const { user, updateUser } = useAuth();
  const search = (needle) => {};

  const buttonContent = (
    <img
      alt="profile"
      className="w-10 cursor-pointer h-10 rounded-full"
      src={`http://localhost:8080/api/users/image/${user.profilePhoto}`}
    />
  );
  const menuItems = [
    <>
      <CgProfile />
      <Link to="/profile">Profile</Link>
    </>,
    <>
      <MdEdit />
      <Link to="/">Edit</Link>
    </>,
    <button
      onClick={(_) => updateUser(null)}
      className="flex items-center space-x-2 text-gray-600 hover:text-primary transition hover:border-primary"
    >
      <CgLogOut />
      <span>Logout</span>
    </button>,
  ];

  return (
    <header className="flex items-center justify-evenly space-x-4 shadow-lg p-2 sm:px-8">
      <div className="hidden sm:block">
        <Link to="/home">
          <img src={logo} alt="logo" className="w-36 h-8 object-cover"/>
        </Link>
      </div>
      <form className="w-full max-w-xs min-w-0">
        <FormInput
          type={"text"}
          placeholder="search"
          onValueChanged={(val) => search(val)}
        >
          <FaSearch />
        </FormInput>
      </form>
      <Menu buttonContent={buttonContent} menuItems={menuItems} />
    </header>
  );
};

export default Header;
