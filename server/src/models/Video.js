import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  filepath: { type: String, required: true, trim: true },
  title: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  hashtags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
