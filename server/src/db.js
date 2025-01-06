import mongoose from "mongoose";
import User from "./models/User";
import Video from "./models/Video";

mongoose.connect("mongodb://127.0.0.1:27017/utube");

const db = mongoose.connection;

db.on("error", (error) => console.log("db error:", error));
db.once("open", async () => {
  console.log("DB Connected.");
  let existingUser = await User.findOne({ email: "test@test" });
  if (existingUser) return;
  existingUser = new User({
    email: "test@test",
    password: "test",
    nickname: "테슷흐",
    location: "오하이오",
    createdAt: Date.now(),
    videos: [],
    comments: [],
    avatar: "",
  });
  await existingUser.save();
  if (existingUser.videos.length >= 1) return;
  const testVideo = new Video({
    filepath: "uploads/test.mp4",
    title: "테슷흐 영상",
    description: "지렸다...지렸다...지렸다...",
    hashtags: Video.formatHashtags("오,우,야"),
    createdAt: Date.now(),
    owner: existingUser._id,
    comments: [],
  });
  await testVideo.save();
  existingUser.videos.push(testVideo._id);
  await existingUser.save();
});
