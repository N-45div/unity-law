import React, { useState } from "react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="pt-16 pb-0 relative">
      <div className="flex justify-between items-center sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white bg-gray-700 px-3 py-2 rounded-md"
        >
          {!isMenuOpen && (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          )}
        </button>
      </div>

      {/* Desktop nav */}
      <div className="hidden sm:flex space-x-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white"
          aria-current="page"
        >
          Progress
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Certification
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-700 hover:text-white"
        >
          Your Profile
        </a>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-gray-700 p-4 flex flex-col space-y-2 z-50">
          <div className="flex justify-end">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white"
            aria-current="page"
          >
            Progress
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Certification
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
          >
            Your Profile
          </a>
        </div>
      )}
    </div>
  );
};

export default Header;
