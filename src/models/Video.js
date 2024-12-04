import mongoose from "mongoose";

// video의 데이터 타입을 결정
// 영상제목, 내용, 생성날짜, 해시태그, 메타데이터(조회수, 좋아요)
// 디테일하게!!
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
