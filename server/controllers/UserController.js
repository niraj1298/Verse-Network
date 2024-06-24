/**
 * User registration, login, update and retrieval logic.
 * Handles user authentication using JWT tokens.
 * Exports register, login, updateUser and getUser functions.
 */
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

dotenv.config();

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object.
 * @returns {string} The JWT token.
 * @example
 * const token = generateToken(user);
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

/**
 * Hashes a password
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 * @example
 * const hashedPassword = hashPassword(password);
 */
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

/**
 * Registers a new user.
 *@param {Object} req - The request object.
 *@param {Object} req.body - The request body.
 *@param {string} req.body.username - The username.
 *@param {string} req.body.password - The password.
 *@param {string} req.body.email - The email.
 *@param {Object} res - The response object.
 *@returns {Object} The response object.
 * @example
 * register(req, res);
 * @throws {Error} - If the username already exists.
 * @throws {Error} - If the email already exists.
 * @throws {Error} - If the registration fails.
 * @throws {Error} - If the server fails to respond.
 * @throws {Error} - If the server fails to connect.
 * @throws {Error} - If the server fails to authenticate.
 */
export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const hashedPassword = hashPassword(password);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();
    console.log("Registration successful");
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 * Logs in a user.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username.
 * @param {string} req.body.password - The password.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 *
 * @throws {Error} If login fails.
 * @throws {Error} If user is not found.
 * @throws {Error} If password is invalid.
 * @throws {Error} If server error occurs.
 */
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === hashPassword(password)) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        userBio: user.userBio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        token: generateToken(user),
      });
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
/**
 * Updates a user's profile information.
 *
 * @param {Object} req - The request object.
 * @param {string} req.user.id - The ID of the user.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username.
 * @param {string} req.body.email - The email.
 * @param {string} req.body.userBio - The user bio.
 * @param {string} req.body.newPassword - The new password.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 *
 * @throws {Error} If user not found.
 * @throws {Error} If username/email already exists.
 * @throws {Error} If server error occurs.
 */
export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { username, email, userBio, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the username or email already exists
    if (username) {
      const existingUsername = await User.findOne({
        username,
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists." });
      }
      user.username = username;
    }
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists." });
      }
      user.email = email;
    }

    if (userBio) user.userBio = userBio;
    if (newPassword) {
      user.password = hashPassword(newPassword);
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      userBio: user.userBio,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Gets a user's profile information.
 *
 * @param {Object} req - The request object.
 * @param {string} req.user.id - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 * @throws {Error} If user not found.
 * @throws {Error} If server error occurs.
 */
export const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      userBio: user.userBio,
      createdAt: user.createdAt,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
