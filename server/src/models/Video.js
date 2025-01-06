import mongoose from "mongoose";
import User from "./User";

const videoSchema = new mongoose.Schema({
  filepath: { type: String, required: true, trim: true },
  title: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  hashtags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

videoSchema.static("formatHashtags", function (hashtags) {
  return String(hashtags)
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.pre("deleteOne", async function (next) {
  const video = await this.model.findOne(this.getQuery());
  if (video) {
    await User.updateOne(
      { _id: video.owner },
      { $pull: { videos: video._id } }
    );
  }
  next();
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
