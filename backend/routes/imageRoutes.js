const express = require("express");
const router = express.Router();
const Image = require("../models/Image");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const { sort } = req.query;

  let sortOption = {};

  if (sort === "newest") sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "popular") sortOption = { likes: -1 };

  try {
    const images = await Image.find().sort(sortOption);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error });
          }

          const newImage = await Image.create({
            url: result.secure_url,
            title: req.body.title,
            uploadedBy: req.user.id,
          });

          res.json(newImage);
        }
      );

      stream.end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
