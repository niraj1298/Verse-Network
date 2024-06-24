/**
 * HomePage view Component
 *
 * @module HomePage
 * @param {object} props - The props passed to the component.
 *
 * @returns {React.Component} A React component that displays the homepage of the application.
 *
 * @example
 * To use HomePage, include it:
 *
 * ```jsx
 * <HomePage />
 * ```
 */

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Button from "../../component/Button.js";
import { useNavigate } from "react-router-dom";

/**
 * The HomePage component.
 *
 * Renders the homepage view with options to register or login.
 *
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage = () => {
  /**
   * The navigate function from react-router-dom.
   */
  const navigate = useNavigate();
  /**
   * The reference to the target element for the Typed component.
   */
  const typedTarget = useRef(null);
  /**
   * useEffect hook to initialize the Typed component.
   * it initializes the Typed component with the given options, and renders
   * the strings in the given array and speed.
   */
  useEffect(() => {
    const typed = new Typed(typedTarget.current, {
      strings: ["VerseNetwork"],
      typeSpeed: 70,
      backSpeed: 50,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  /**
   * Handles login button click.
   *
   * Navigates to the login page.
   */
  const handleLogin = () => {
    navigate("/login");
  };

  /**
   * Handles register button click.
   *
   * Navigates to the register page.
   */
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 h-screen flex flex-col justify-center items-center">
      <div className="container text-white mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to <span ref={typedTarget}></span>
        </h2>
        <p className="text-lg">
          Join VerseNetwork — where gamers unite to share, connect, and level up
          together. Register or log in now!
        </p>
      </div>

      <div className="flex flex-row gap-4 my-10">
        <Button onClick={handleRegister}>Register</Button>
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
};

export default HomePage;
