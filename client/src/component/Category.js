import React from "react";
import { Link } from "react-router-dom";

const Category = ({ category, image }) => {
  const isImageComponent = React.isValidElement(image);

  return (
    <Link
      to={`/forum/${category}`}
      className="border border-gray-300 rounded-lg p-4 flex items-center hover:bg-slate-50"
      style={{
        textDecoration: "none",
        color: "inherit",
        height: "150px",
        width: "600px",
      }}
    >
      {isImageComponent ? (
        React.cloneElement(image, { className: "w-20 h-14 rounded-full mr-4" })
      ) : (
        <img src={image} alt="pic" className="w-20 h-14 rounded-full mr-4" />
      )}
      <div>
        <h1 className="text-xl font-bold">{category}</h1>
        <p className="text-gray-500">View posts here!</p>
      </div>
    </Link>
  );
};

export default Category;
