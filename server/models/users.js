/**
 * User model schema for MongoDB.
 * Defines the fields stored for each user document.
 */
import mongoose from "mongoose";

/**
 * User schema definition.
 * @typedef {Object} UserSchema
 * @property {string} username - Required, unique username.
 * @property {string} password - Required password.
 * @property {string} email - Required, unique email.
 * @property {string} [profileImage] - Optional profile image URL.
 * @property {string} [userBio] - Optional user biography.
 * @property {Date} createdAt - Date user was created.
 * @property {Date} updatedAt - Date user was last updated.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    userBio: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (val) =>
        val.toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
  }
);

/**
 * User model.
 * @type {Model}
 */
const User = mongoose.model("User", userSchema);

export default User;
