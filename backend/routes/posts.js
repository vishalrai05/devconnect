const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name avatar skills");

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load posts", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      author: req.user.id,
      content: content.trim()
    });

    const populatedPost = await post.populate("author", "name avatar skills");
    return res.status(201).json({ post: populatedPost });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create post", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete post", error: error.message });
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likes.some((userId) => userId.toString() === req.user.id);
    if (hasLiked) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    const populatedPost = await post.populate("author", "name avatar skills");

    return res.json({ post: populatedPost });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update like", error: error.message });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user.id,
      text: text.trim()
    });

    const populatedComment = await comment.populate("author", "name avatar");
    return res.status(201).json({ comment: populatedComment });
  } catch (error) {
    return res.status(500).json({ message: "Unable to add comment", error: error.message });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate("author", "name avatar");

    return res.json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load comments", error: error.message });
  }
});

module.exports = router;
