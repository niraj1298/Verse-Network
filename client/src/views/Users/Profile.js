/**
 * Profile view component.
 *
 * @module Profile
 * @component
 *
 * @description The Profile component displays the user's profile information and allows updating it.
 * It utilizes React hooks for state management and effect handling. The component interacts with a
 * custom authentication context to access and update the user's details. Image upload and profile
 * update functionalities are implemented with asynchronous fetch requests, incorporating error
 * handling to enhance user experience.
 *
 * @example
 * <Profile />
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import ActionButton from "../../component/ActionButton";

/**
 * Represents the profile component.
 * @function
 * @name Profile
 * @returns {JSX.Element} - The profile component JSX element.
 */
const Profile = () => {
  /**
   * uses the useAuth hook to get the auth object and the updateUserDetails function
   */
  const { auth, updateUserDetails } = useAuth();
  /**
   * state hook for username input
   */
  const [inputUsername, setInputUsername] = useState("");
  /**
   * state hook for email input
   */
  const [inputEmail, setInputEmail] = useState("");
  /**
   * state hook for user bio input
   */
  const [inputUserBio, setInputUserBio] = useState("");
  /**
   * state hook for profile image URL
   */
  const [profileImageUrl, setProfileImageUrl] = useState("");

  /**
   * Placeholder image URL for default profile picture or in case of loading errors.
   */
  const placeholderImageUrl =
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2NlOHhoNnBxdDR6aWpiemhsb2xmdWRucWt1MGV5NXBpZGgwY2pkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNRowezfsJcFSo/giphy.gif";

  /**
   * Fetches the user's profile image from the server using the authentication token and updates the profile image URL state.
   * If the fetch request fails, it sets the profile image URL to a placeholder image.
   * @function
   * @name fetchUserProfile
   * @async
   * @throws {Error} - If the fetch request fails.
   * @uses auth.token - The user's authentication token.
   * @uses setProfileImageUrl - The function to set the profile image URL state.
   * @uses placeholderImageUrl - The placeholder image URL.
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/getUser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const { profileImage } = await response.json();
      setProfileImageUrl(
        profileImage
          ? `http://localhost:5000/${profileImage}`
          : placeholderImageUrl
      );
      console.log("Fetched profile image path: ", profileImage);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileImageUrl(placeholderImageUrl);
    }
  }, [auth.token]);

  /**
   * A React effect hook that fetches the user's profile information when the component mounts.
   * @see fetchUserProfile - The function to fetch the user's profile information.
   */
  useEffect(() => {
    console.log("Effect: Fetching user profile");
    fetchUserProfile();
  }, [fetchUserProfile]);

  /**
   * Handles the form submission to update the user's profile. It sends a PUT request to the server to update the user's profile information.
   * If the request is successful, it updates the local user details state and clears the input fields.
   * If the request fails, it displays an error message to the user.
   * @function
   * @name handleUpdateProfile
   * @async
   * @param {Event} e - The event object.
   * @throws {Error} - If the fetch request fails.
   * @uses auth.token - The user's authentication token.
   * @uses updateUserDetails - The function to update the local user details state.
   * @uses window.alert - The browser's alert function to display messages to the user.
   * @returns {undefined}
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log(
      "Updating profile with:",
      inputUsername,
      inputEmail,
      inputUserBio
    );
    const updatedUserInfo = {
      username: inputUsername,
      email: inputEmail,
      userBio: inputUserBio,
    };

    try {
      const response = await fetch("http://localhost:5000/updateUser", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserInfo),
      });

      if (!response.ok) {
        // Assuming the server responds with a JSON object that includes an error message
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      const updatedUserDetails = await response.json();
      alert("Profile updated successfully");

      updateUserDetails(updatedUserDetails); // Update local user details state
      setInputUsername("");
      setInputEmail("");
      setInputUserBio("");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message); // Display error message to the user
    }
  };

  /**
   * Handles the image upload functionality. It sends a POST request to the server to upload the image.
   * If the request is successful, it updates the profile image URL state and displays a success message to the user.
   * If the request fails, it displays an error message to the user.
   * @function
   * @name handleImageUpload
   * @async
   * @param {Event} e - The event object representing the change event from the file input.
   * @throws {Error} - If the fetch request fails or if the file type is not supported.
   * @uses auth.token - The user's authentication token.
   * @uses setProfileImageUrl - The function to set the profile image URL state.
   * @uses window.alert - The browser's alert function to display messages to the user.
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image/jpeg|image/png|image/gif")) {
      alert("Unsupported file type. Only JPG, PNG, and GIF are allowed.");
      return;
    }

    console.log("Uploading image:", file.name);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      const result = await response.json();

      alert("Image uploaded successfully");
      setProfileImageUrl(`http://localhost:5000/${result.profileImage}`);
      console.log(
        "Image uploaded successfully:",
        `http://localhost:5000/${result.profileImage}`
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error.message); // Display error message to the user
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-gray-50"
      data-testid="profile-container"
    >
      <div className="bg-white w-2/5 h-vh border-2 border-gray-200 rounded-lg shadow-2xl p-8 flex flex-col justify-center items-center space-y-6">
        <form
          onSubmit={handleUpdateProfile}
          className="w-full"
          data-testid="update-profile-form"
        >
          <h1
            className="text-3xl font-semibold text-gray-800 text-center mb-6"
            data-testid="welcome-header"
          >
            Welcome, {auth.userDetails?.username}!
          </h1>
          <div className="flex flex-col items-center gap-4 m-6">
            <img
              src={profileImageUrl || placeholderImageUrl}
              onError={() => {
                console.log("Error loading image. Using placeholder");
                setProfileImageUrl(placeholderImageUrl);
              }}
              alt="Profile"
              className="rounded-full w-48 h-48 object-cover border-2 border-gray-400 shadow hover:shadow-md transition-shadow duration-300 ease-in-out"
              data-testid="profile-image"
            />
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 shadow-sm my-4"
            data-testid="user-bio"
          >
            <p data-testid="test-bio" className="text-lg mb-2">
              {auth.userDetails?.userBio}
            </p>
            <p className="text-xs text-color-gray">
              Member since: {auth.userDetails?.createdAt}
            </p>
            <p data-testid="test-email" className="text-xs text-color-gray">
              Email: {auth.userDetails?.email}
            </p>
          </div>
          <div>
            <hr className="my-4"></hr>
            <h1
              className="text-2xl font-semibold text-gray-800 text-center mb-6"
              data-testid="edit-profile-header"
            >
              Edit Profile
            </h1>
          </div>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="image-upload"
              onChange={handleImageUpload}
              className="form-input border border-gray-300 rounded-lg file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-blue-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200 ease-in-out w-full text-sm text-gray-700"
              data-testid="image-upload-input"
            />
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Name"
              className="form-input border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="username-input"
              data-testid="username-input"
            />
            <input
              type="text"
              value={inputUserBio}
              onChange={(e) => setInputUserBio(e.target.value)}
              placeholder="Bio"
              className="form-input border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="userBio-input"
              data-testid="userbio-input"
            />
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="Email"
              className="form-input border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="email-input"
              data-testid="email-input"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
              data-testid="update-profile-button"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
      <div className="fixed bottom-10 right-10 z-50">
        <ActionButton />
      </div>
    </div>
  );
};

export default Profile;
