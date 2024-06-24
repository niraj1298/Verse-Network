/**
 * Main application server.
 * Handles API routes and database connection.
 */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  updateUser,
  getUser,
} from "./controllers/UserController.js";
import {
  createPost,
  getPostsByCategory,
  updatePost,
  deletePost,
  addCommentToPost,
  getPostById,
} from "./controllers/postController.js";

import User from "./models/users.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

/** Express app instance */
const app = express();
/** Port number for the server */
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use("/uploads", express.static("uploads"));

/**
 * Establishes a connection to the MongoDB database using the connection URI
 * provided in the environment variables.
 */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/**
 * Middleware to verify the JWT token provided in the Authorization header of the request.
 * If the token is valid, the decoded user information is attached to the request object.
 * Otherwise, it sends an appropriate response indicating the error.
 *
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function in the stack.
 */
const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  const bearerToken = bearerHeader.split(" ");
  if (bearerToken.length !== 2 || bearerToken[0].toLowerCase() !== "bearer") {
    return res
      .status(403)
      .json({ message: "Access denied. Invalid token format." });
  }

  const token = bearerToken[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Handle different types of JWT errors
      const message =
        err.name === "TokenExpiredError"
          ? "Token is expired."
          : err.name === "JsonWebTokenError"
          ? "Invalid token."
          : "Failed to authenticate token.";
      return res.status(401).json({ message });
    }
    req.user = decoded;
    next();
  });
};

/**
 * Multer storage configuration to handle file uploads. It specifies the destination
 * directory for the uploaded files and the naming convention for the files.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * POST endpoint to handle profile image uploads. It uses Multer middleware for
 * uploading files and performs additional validation on the file type.
 * Responds with the path of the uploaded file or an error message if the upload fails.
 *
 * @route POST /upload
 * @param {express.Request} req - The request object, expecting a file in the 'profileImage' field.
 * @param {express.Response} res - The response object.
 * @returns {void} - The response status and message are sent back to the client.
 */
app.post(
  "/upload",
  verifyToken,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      // Check if file is allowed image type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .send("Invalid file type. Only jpg, png, and gif allowed.");
      }

      const user = await User.findById(req.user.id);
      user.profileImage = req.file.path;
      await user.save();

      res.status(200).json({
        message: "File uploaded successfully.",
        profileImage: req.file.path,
      });

      console.log("File uploaded successfully");
    } catch (error) {
      res.status(500).send(error.message);
      console.error("Error uploading image:", error);
    }
  }
);

/**
 * API routes.
 */

/**
 * Registers a new user account.
 * @route POST /register
 */
app.post("/register", register);
/**
 * Authenticates a user and returns a JWT token.
 * @route POST /login
 */
app.post("/login", login);
/**
 * Updates user profile information for an authenticated user.
 * @route PUT /updateUser
 */
app.put("/updateUser", verifyToken, updateUser);
/**
 * Retrieves the profile information of an authenticated user.
 * @route GET /getUser
 */
app.get("/getUser", verifyToken, getUser);

app.post("/posts/create", verifyToken, createPost);
app.get("/posts/:category", verifyToken, getPostsByCategory);
app.get("/posts/getPost/:postId", verifyToken, getPostById);
app.put("/posts/:postId", verifyToken, updatePost);
app.post("/posts/comment/:postId", verifyToken, addCommentToPost);
app.delete("/posts/:postId", verifyToken, deletePost);

/**
 * Starts the Express server on the specified port and logs a message to the console
 * indicating that the server is running and listening for requests.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
