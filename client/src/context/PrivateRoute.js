/**
 * PrivateRoute component to handle protected routes in React Router v6
 *
 * @module PrivateRoute
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * PrivateRoute component to protect routes from unauthenticated users.
 * Redirects to /login if user is not authenticated.
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 *
 * @returns {ReactNode} The child components or <Navigate> if not authenticated
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  const isAuthenticated = auth.token !== null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
