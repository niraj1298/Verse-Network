/**
 * NavBar component. Used to render the navigation bar, for navigation.
 *
 * @module NavBar
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children elements
 * @returns {JSX.Element} The NavBar component.
 */

import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/versenetwork.png";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white p-2 border-b-2 border-black border-opacity-20 shadow-xl">
      <ul className="flex justify-center space-x-4">
        <li className="p-5">
          <Link to="/">Home</Link>
        </li>
        <li>
          <img src={Logo} alt="Logo" className="h-20 w-20" />
        </li>
        <li className="p-5">
          <Link to="/forum">Forum</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
