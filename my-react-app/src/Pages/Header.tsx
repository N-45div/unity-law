import React from "react";

const Header: React.FC = () => {
  return (
    <div className="hidden sm:ml-6 sm:block pt-16 pb-0 ">
      <div className="flex space-x-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Can remove this line, once we implement the actual routing
          className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white"
          aria-current="page"
        >
          Progress
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Can remove this line, once we implement the actual routing
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Certification
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()} // Can remove this line, once we implement the actual routing
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Your Profile
        </a>
      </div>
    </div>
  );
};

export default Header;
