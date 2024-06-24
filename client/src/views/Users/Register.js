/**
 * Register view component.
 *
 * Renders a registration form for users to create a new account.
 *@module Register
 * @param {Object} props - The component props.
 * @param {Function} props.onRegister - Callback function when user successfully registers.
 *
 * @returns {React.Component} The Register component.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../component/Button";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  /**
   * Set username state to empty string by default.
   */
  const [username, setUsername] = useState("");
  /**
   * Set password state to empty string by default.
   */
  const [password, setPassword] = useState("");
  /**
   * Set email state to empty string by default.
   */
  const [email, setEmail] = useState("");
  /**
   * Set error state to null by default.
   */
  const [error, setError] = useState("");

  /**
   * Set navigate to the useNavigate hook.
   */
  const navigate = useNavigate();
  /**
   * use Auth hook to get login function.
   */
  const { login } = useAuth(); //  login function is available in useAuth

  /**
   * Handles the form submission to register a new user. It sends a POST request to the server with the user's information.
   * If the request is successful, it logs in the new user and navigates to the forum page.
   * If the request fails, it displays an error message to the user.
   * @function
   * @name handleSubmit
   * @async
   * @param {Event} e - The event object.
   * @throws {Error} - If the fetch request fails or if the registration fails.
   * @uses fetch - The fetch function to send a request to the server.
   * @uses login - The function to log in the user.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before attempting registration

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      login(data.token, {
        username: data.username,
        email: data.email,
        _id: data._id,
      });
      navigate("/forum");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            User Register
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
        <form className="mt-8 space-y-6 justify-center" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Register</Button>
        </form>
        <div className="text-sm text-center">
          <a
            href="/login"
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
