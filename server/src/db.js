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
  if (existingUser.videos.length >= 20) {
    console.log("이미 20개 이상의 영상이 존재합니다.");
    return;
  }
  const videoPromises = [];
  for (let i = 1; i <= 20; i++) {
    const testVideo = new Video({
      filepath: `uploads/test.mp4`,
      title: `테슷흐 영상 ${i}`,
      description: `끼야호우 (${i})`,
      hashtags: Video.formatHashtags("무,야,호"),
      createdAt: Date.now(),
      owner: existingUser._id,
      comments: [],
    });
    videoPromises.push(testVideo.save());
  }
  const savedVideos = await Promise.all(videoPromises);
  existingUser.videos = savedVideos.map((video) => video._id);
  await existingUser.save();
});
