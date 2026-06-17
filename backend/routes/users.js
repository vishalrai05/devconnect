const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const { skill } = req.query;
    const query = {};

    if (skill && skill.trim()) {
      query.skills = { $regex: skill.trim(), $options: "i" };
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load users", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load user", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const { bio, skills, github, linkedin } = req.body;
    const parsedSkills = Array.isArray(skills)
      ? skills
      : String(skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bio: bio || "",
        skills: parsedSkills,
        github: github || "",
        linkedin: linkedin || ""
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile", error: error.message });
  }
});

router.post("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own avatar" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to upload avatar", error: error.message });
  }
});

module.exports = router;
