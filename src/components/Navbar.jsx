import React, { useState } from "react";
import { Link } from "react-router-dom"; // ใช้ Link จาก React Router
import { useAuthContext } from "../context/AuthContext"; // นำเข้า AuthContext

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    window.location.href = "/login"; 
  };

  const handleMenuClick = () => {
    setIsOpen(false); 
  };

  // Check if the user has the "ROLES_ADMIN" role
  const isAdmin = user?.roles?.includes("ROLES_ADMIN");

  return (
    <div className="navbar" style={{ backgroundColor: "#A020F0" }}>
      {/* Left side: logo/title */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          STORE DELIVERY ZONE
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex-none md:hidden">
        <button
          className="btn btn-square btn-ghost text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="flex-none hidden md:flex items-center space-x-4">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/" className="text-white hover:text-blue-200">
              Home
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/Add" className="text-white hover:text-blue-200">
                Add
              </Link>
            </li>
          )}
        </ul>

        {user ? (
          <div className="flex items-center space-x-2">
            <span className="text-white bg-blue-900 px-3 py-1 rounded">
              {user.username}
            </span>
            <span className="text-white bg-orange-600 px-3 py-1 rounded">
              {user.roles[0]}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-blue-200">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-blue-200">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 right-0 z-10 bg-blue-600 shadow-md rounded-lg md:hidden">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link to="/" className="block text-white hover:text-blue-200" onClick={handleMenuClick}>
                Home
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/Add" className="block text-white hover:text-blue-200" onClick={handleMenuClick}>
                  Add
                </Link>
              </li>
            )}
            {user ? (
              <li className="flex items-center space-x-2">
                <span className="block text-white bg-blue-900 px-3 py-1 rounded">
                  {user.username}
                </span>
                <span className="block text-white bg-orange-600 px-3 py-1 rounded">
                  {user.roles[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="block text-white hover:text-blue-200" onClick={handleMenuClick}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block text-white hover:text-blue-200" onClick={handleMenuClick}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
