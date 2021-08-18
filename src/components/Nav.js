import { FaHome, FaCog, FaBell, FaUserFriends,FaPlus } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Li from "./Li";
import { useRequestCounter } from "../context/RequestCounterProvider";

const Nav = () => {
  const { counter } = useRequestCounter();
  return (
    <nav className="fixed border border-gray-300 top-1/2 left-0  transform -translate-y-1/2 shadow-xl bg-white">
      <ul>
        <Li>
          <Link to="/home">
            <FaHome />
          </Link>
        </Li>
        <Li>
          <Link to="/add-post">
            <FaPlus />
          </Link>
        </Li>
        <Li>
          <Link to="/friend-request">
            <div className="relative">
              <span className="absolute text-xs -right-2 z-10 -top-2 text-red-600 font-bold">
                {counter}
              </span>
              <FaUserFriends />
            </div>
          </Link>
        </Li>
        <Li>
          <Link to="">
            <FaBell />
          </Link>
        </Li>
        <Li>
          <Link to="/conversations">
            <BsChatFill />
          </Link>
        </Li>
        <Li>
          <Link to="">
            <FaCog />
          </Link>
        </Li>
      </ul>
    </nav>
  );
};

export default Nav;
