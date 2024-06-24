/**
 * Button component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed inside the button.
 * @param {Function} props.onClick - The function or actions to be called when the button is clicked.
 * @param {String} [props.className] - Additional CSS classes to apply for custom styling.
 * @returns {React.Component} - The Button component.
 *
 * @component Button
 */

import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded transition duration-300 ease-in-out ${className}`}
      style={{ width: "100px" }}
    >
      {children}
    </button>
  );
};

export default Button;
