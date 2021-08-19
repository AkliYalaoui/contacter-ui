import Toggle from "react-toggle";
import "../style.css";
import { useState } from "react";
import { BsMoon } from "react-icons/bs";
import { BiSun } from "react-icons/bi";

const Settings = () => {
  const [mode, setMode] = useState(() => {
    const tmp = localStorage.getItem("mode");
    if (tmp === "dark") return "dark";
    return "light";
  });

  const changeMode = (val) => {
    if (val) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mode", "dark");
      setMode("dark");
    } else {
      localStorage.setItem("mode", "light");
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="text-gray-600 dark:text-white my-10">
      <div className="flex items-center my-2 justify-between max-w-sm m-auto  px-4 py-3 rounded bg-gray-200 dark:bg-dark800">
        <span id="mode-label">
          {mode === "dark" ? "Disable dark mode" : "Enable dark mode"}
        </span>
        <Toggle
          id="mode-status"
          icons={{
            checked: <BsMoon color="#fff" />,
            unchecked: <BiSun color="orange" />,
          }}
          defaultChecked={mode === "dark"}
          aria-labelledby="mode-label"
          onChange={(e) => changeMode(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default Settings;
