import { useState } from "react";
import iconImage from '../assets/quizIcon.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buttonStyle = {
    fontFamily: "'Pixelify Sans' , sans-serif",
    display: "flex",
    fontWeight: 400,
    fontSize: "35px",
    color: "black",
    textTransform: "uppercase" as "uppercase",


  }

  return (
    <nav >
      <div className="mx-auto max-w-7xl px-2 sm:px-0 lg:px-0 pt-8">
        <div className="relative flex h-16 items-center justify-between ">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* Notifications and Profile */}
          <div className="absolute inset-y-0 left-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
            {/* <button
              type="button"
              className=""
            > */}
            {/* <span className="absolute -inset-1.5"></span> */}
            {/* <span className="sr-only">View notifications</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg> */}
            {/* </button> */}

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                type="button"
                className="relative flex  text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >

                <img src={iconImage}
                  alt="Icon"
                  style={{ width: "150px", height: "150px" }}
                />
              </button>


            </div>
          </div>
          {/* Logo and Navigation Links */}
          <div className="flex flex-1 items-center justify-end sm:items-stretch">

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 justify-between" >
                <a
                  href="#"
                  className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]"
                  aria-current="page"
                ><span style={buttonStyle}>  FUN FACT</span>

                </a>
                <a
                  href="#"
                  className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]"
                ><span style={buttonStyle}>PROGRESS</span>

                </a>
                {/* <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Projects
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Calendar
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a
              href="#"
              className="block rounded w-auto px-3 py-2 text-base font-medium bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]"
              aria-current="page"
            >
              FUN FACT
            </a>
            <a
              href="#"
              className="block rounded w-auto px-3 py-2 text-base font-medium bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]"
              aria-current="page"
            >
              PROGRESS
            </a>
            {/* <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </a> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



