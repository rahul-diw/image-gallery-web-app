const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: String,
    title: String,
    uploadedBy: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }   // 🔥 yaha add karna hai
);

module.exports = mongoose.model("Image", imageSchema);