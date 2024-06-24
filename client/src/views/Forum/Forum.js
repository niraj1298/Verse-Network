/**
 * Forum Component
 * @module Forum
 * @param {Object} props - The component props
 * @param {Function} props.onLogout - The function to be called when the user logs out
 * @returns {React.Component} - A React component that displays the forum page of the application
 *
 * @example
 *
 * ```jsx
 * <Forum />
 * ```
 */

import React from "react";
import ActionButton from "../../component/ActionButton";
import Category from "../../component/Category";
import { RiChat1Line } from "react-icons/ri";
import { IoGameController } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";

const Forum = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-4 mb-10 ">
        <h1 className="text-4xl font-bold mb-4 ">Forum Page</h1>
        <p className="text-gray-500 text-lg">
          Welcome to the forum! Select a category to view posts.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Category image={<RiChat1Line />} category="General" />
        <Category image={<IoGameController />} category="Gaming" />
        <Category image={<FaQuestionCircle />} category="Q&A" />
      </div>
      <div className="fixed bottom-10 right-10 z-50">
        <ActionButton />
      </div>
    </div>
  );
};

export default Forum;
