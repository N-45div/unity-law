import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [slideIn, setSlideIn] = useState(false);
  useEffect(() => {
    setSlideIn(true);
  }, []);

  return (
    <div
      className={`pt-16 pb-0 ml-6 transition-transform duration-700 ease-out transform ${
        slideIn ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-wrap space-x-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white"
          aria-current="page"
        >
          Progress
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Certification
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Remove this line when implementing actual routing
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Your Profile
        </a>
      </div>
    </div>
  );
};

export default Header;
