/**
 * @file App.js is the root component of the application. It contains the routes for the application and the context provider for the authentication context.
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import Homepage from "./views/Home/Homepage";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import Login from "./views/Users/Login";
import Register from "./views/Users/Register";
import Forum from "./views/Forum/Forum";
import Profile from "./views/Users/Profile";
import PrivateRoute from "./context/PrivateRoute";
import General from "./views/Forum/General";
import Gaming from "./views/Forum/Gaming";
import QA from "./views/Forum/QA";
import ViewPost from "./views/Forum/ViewPost";
import CreatePost from "./views/Forum/CreatePost";

/**
 * RedirectForum component to redirect authenticated users to /forum
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @returns {ReactNode} The child components or <Navigate> if authenticated
 * @example
 * <RedirectForum>
 *  <Login />
 * </RedirectForum>
 */
const RedirectForum = ({ children }) => {
  const { auth } = useAuth();
  return auth.token ? <Navigate to="/forum" /> : children;
};
/**
 * App component
 * @returns {React.Component} The root component of the application, containing routes and the authentication context provider.
 * @example
 * <App />
 */
function App() {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/login"
              element={
                <RedirectForum>
                  <Login />
                </RedirectForum>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectForum>
                  <Register />
                </RedirectForum>
              }
            />
            <Route
              path="/forum"
              element={
                <PrivateRoute>
                  <Forum />
                </PrivateRoute>
              }
            />
            <Route
              path="/forum/general"
              element={
                <PrivateRoute>
                  <General />
                </PrivateRoute>
              }
            />
           <Route
              path="/forum/gaming"
              element={
                <PrivateRoute>
                  <Gaming />
                </PrivateRoute>
              }
            />
            <Route
              path="/forum/q&a"
              element={
                <PrivateRoute>
                  <QA />
                </PrivateRoute>
              }
            />
            <Route path="/forum/create-post" element={<PrivateRoute> <CreatePost /> </PrivateRoute> } />
            <Route path="/forum/post/:postId" element={<PrivateRoute> <ViewPost /> </PrivateRoute>} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;