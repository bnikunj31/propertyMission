import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar2 = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token")
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!sessionStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    setIsAuthenticated(false);
    navigate("/Signin");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-gray-200 mb-3 bg-[#2c3e50] dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-2 mx-auto">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={closeMobileMenu}
        >
          <span className="flex flex-col self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <img
              src={logo}
              alt="RealEstate Logo"
              className="object-contain w-40 h-auto md:h-12 lg:h-14"
            />
          </span>
        </Link>

        {/* Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-solid-bg"
        >
          <ul className="flex flex-col font-medium rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link
                to="/admin"
                className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/AddCategory"
                className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={closeMobileMenu}
              >
                Add Category
              </Link>
            </li>
            <li>
              <Link
                to="/PropertyForm"
                className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={closeMobileMenu}
              >
                Add Properties
              </Link>
            </li>

            <li className="relative group">
              <Link
                to="#"
                className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Menu
              </Link>

              <ul className="absolute z-10 hidden w-48 p-1 py-2 bg-gray-700 rounded-lg shadow-lg group-hover:block dark:bg-gray-700">
                <li>
                  <Link
                    to="/users"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                    onClick={closeMobileMenu}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                    onClick={closeMobileMenu}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/properties"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                    onClick={closeMobileMenu}
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/enquires"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                    onClick={closeMobileMenu}
                  >
                    Enquiries
                  </Link>
                </li>
              </ul>
            </li>

            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="flex">
                <Link
                  to="/Register"
                  className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={closeMobileMenu}
                >
                  Signup
                </Link>
                <span className="text-white">/</span>
                <Link
                  to="/Signin"
                  className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={closeMobileMenu}
                >
                  Signin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
