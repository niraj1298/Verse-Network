/**
 * Footer Component
 * @module Footer
 */

import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer component displays the footer section of the application
 * @example
 * ```jsx
 * <Footer />
 * ```
 */
const Footer = () => {
  return (
    <footer className="bg-black text-white p-5 flex flex-col md:flex-row justify-between items-center">
      <div className="flex flex-col items-center md:items-start mb-5 md:mb-0">
        <div className="text-center">
          <h1 className="text-xl font-bold">VerseNetwork</h1>
          <p className="text-xs">where gamers unite to share,</p>
          <p className="text-xs">connect, and level up together.</p>
          <p className="text-xs my-3">
            © 2024 VerseNetwork. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4">
        <ul className="flex flex-col md:flex-row items-center md:space-x-4">
          <li className="mt-2 md:mt-0">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>

          <li className="mt-2 md:mt-0">
            <Link to="/forum" className="hover:text-gray-300">
              Forum
            </Link>
          </li>

          <li className="mt-2 md:mt-0">
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
          </li>

          <li className="mt-2 md:mt-0">
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
