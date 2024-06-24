import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/users.js";


export const createPost = async (req, res) => {
  const { title, content, category } = req.body; 
  const userId = req.user.id; 

  try {
    const post = new Post({
      title,
      content,
      category,
      user: userId,
      author: req.user.username,
    });
    await post.save(); 
    res.status(201).json(post); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await Post.find({ category }).populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("user", "username") 
      .populate({
        path: "comments",
        select: "content user createdAt", 
        populate: { path: "user", select: "username" }, 
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      content,
      post: postId,
      user: userId,
    });
    await comment.save();
    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};