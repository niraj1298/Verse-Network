/**
 * Login component.
 *
 * @module Login
 */

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../component/Button";

/**
 * Login component. Handles user login.
 * @function Login
 * @returns {JSX.Element} - The rendered component JSX.
 */
const Login = () => {
  /**
   * Set username state to empty string by default.
   */
  const [username, setUsername] = useState("");
  /**
   * Set password state to empty string by default.
   */
  const [password, setPassword] = useState("");
  /**
   * use Auth hook to get login function.
   */
  const { login } = useAuth();
  /**
   * Set error state to null by default.
   */
  const [error, setError] = useState(null);
  /**
   * Set navigate to the useNavigate hook.
   */
  const navigate = useNavigate();

  /**
   * Handle form submit.
   * @param {React.FormEvent} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    // Prevent default form behavior
    e.preventDefault();

    try {
      // Make login request
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Handle errors
      if (!response.ok) {
        throw new Error("Login failed");
      }

      // Get response data
      const data = await response.json();

      // Update auth context
      login(data.token, {
        username: data.username,
        email: data.email,
        _id: data._id,
        userBio: data.userBio,
        profileImage: data.profileImage,
        createdAt: data.createdAt,
      });

      // Redirect to forum
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
            User Login
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button onClick={handleSubmit}>Login</Button>
        </form>

        <div className="text-sm text-center">
          <a
            href="/register"
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
