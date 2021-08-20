import { useState } from "react";
import Li from "./Li";

const Menu = ({ buttonContent, menuItems }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative">
      <button onClick={(_) => setOpened((prev) => !prev)}>
        {buttonContent}
      </button>
      {opened && (
        <ul className="absolute top-14 z-10 right-0 bg-white dark:bg-dark800 shadow-2xl border border-gray-300 dark:border-gray-600 w-40">
          {menuItems.map((item, id) => (
            <Li key={id}>{item}</Li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;
