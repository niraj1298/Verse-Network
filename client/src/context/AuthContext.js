/**
 * AuthContext
 *
 * Provides authentication state and functions to the application.
 *
 * @module AuthContext
 */

import React, { createContext, useContext, useState } from "react";

/**
 * Auth context object.
 *
 * @typedef {Object} AuthContext
 * @property {AuthState} state - The authentication state.
 * @property {Function} login - Logs the user in.
 * @property {Function} logout - Logs the user out.
 * @property {Function} updateUser - Updates the user's details.
 */
export const AuthContext = createContext();

/**
 * Custom hook to access the auth context.
 *
 * @returns {AuthContext} The auth context object.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Auth context provider component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 *
 * @returns {React.ReactElement} The provider component.
 */
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userDetailsRaw = localStorage.getItem("userDetails");
    const userDetails =
      userDetailsRaw && userDetailsRaw !== "undefined"
        ? JSON.parse(userDetailsRaw)
        : {};
    return { token, userDetails };
  });

  /**
   * Logs the user in.
   *
   * @param {string} token - The auth token.
   * @param {Object} userDetails - The user details object.
   */
  const login = (token, userDetails) => {
    setAuth({ token, userDetails });
    localStorage.setItem("token", token);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  /**
   * Logs the user out.
   */
  const logout = () => {
    setAuth({ token: null, userDetails: {} });
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
  };

  /**
   * Updates the user's details.
   *
   * @param {Object} updatedDetails - The updated details.
   */
  const updateUserDetails = (updatedDetails) => {
    console.log("Updating profile image to:", updatedDetails.profileImage);

    setAuth((prevAuth) => {
      const updatedAuth = {
        ...prevAuth,
        userDetails: {
          ...prevAuth.userDetails,
          ...updatedDetails,
        },
      };
      localStorage.setItem(
        "userDetails",
        JSON.stringify(updatedAuth.userDetails)
      );
      return updatedAuth;
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
