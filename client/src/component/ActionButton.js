/**
 * ActionButton component renders a menu button that shows a dropdown
 * menu for navigation and logout when clicked.
 *
 * Handles toggling menu visibility on click.
 * Handles navigation to given path on menu item click.
 * Handles calling logout function on logout button click.
 *
 * @component ActionButton
 * @example
 * ```jsx
 * <ActionButton />
 * ```
 *
 * @returns {JSX.Element} - Rendered ActionButton component
 *
 * @param {function} navigate - useNavigate hook to navigate between routes
 * @param {function} logout - Logout function from AuthContext
 *
 * @state showMenu {boolean} - Whether to show menu or not
 *
 * @fires handleNavigate - Handles navigation when menu item clicked
 * @fires handleLogout - Handles calling logout on click
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../assets/logout.png";
import MenuIcon from "../assets/menu.png";
import Users from "../assets/group.png";
import Profile from "../assets/user.png";
import { useAuth } from "../context/AuthContext";

const ActionButton = () => {
  /**
   * Set showMenu state to false by default.
   */
  const [showMenu, setShowMenu] = useState(false);
  /**
   * Set navigate to the useNavigate hook.
   */
  const navigate = useNavigate();
  /**
   * Set logout to the logout function from useAuth.
   */
  const { logout } = useAuth();
  /**
   * Handles click event for navigation.
   * Navigates to the given path.
   * @param {*} path
   */
  const handleNavigate = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  /**
   * Handles click event for logout.
   * Calls logout function from useAuth.
   * Navigates to the login page.
   * @param {*} path
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="mb-2 p-0 w-12 h-12 bg-blue-700 rounded-full hover:bg-blue-500 text-white shadow-lg flex items-center justify-center"
      >
        <img src={MenuIcon} alt="Menu" className="w-6 h-6" />
      </button>

      {showMenu && (
        <div className="bg-white shadow-lg rounded-lg">
          <button
            className="p-2 text-left w-full hover:bg-gray-100"
            onClick={() => handleNavigate("/profile")}
          >
            <img src={Profile} alt="Profile" className="inline w-6 h-6 mr-2" />
            Profile
          </button>
          <button
            className="p-2 text-left w-full hover:bg-gray-100"
            onClick={() => handleNavigate("/users")}
          >
            <img src={Users} alt="Users" className="inline w-6 h-6 mr-2" />
            View Users
          </button>
          <button
            className="p-2 text-left w-full hover:bg-gray-100"
            onClick={handleLogout}
          >
            <img
              src={LogoutIcon}
              alt="Logout"
              className="inline w-6 h-6 mr-2"
            />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
