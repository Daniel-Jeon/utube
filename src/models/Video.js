import mongoose from "mongoose";

// video의 데이터 타입을 결정
// 영상제목, 내용, 생성날짜, 해시태그, 메타데이터(조회수, 좋아요)
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
