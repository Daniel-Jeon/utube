import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "HOME", videos });
};

export const getUploadVideo = (req, res) => {
  return res.render("videos/upload", { pageTitle: "UPLOAD" });
};

export const postUploadVideo = async (req, res) => {
  const {
    body: { title, description, hashtags },
    session: { user: _id },
    file: { path: videoUrl },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
      videoUrl,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "UPLOAD",
      errorMessage: error.message,
    });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  // watch에서 populate를 한 이유는 업로드한 유저의 정보가 필요하기 때문
  const video = await Video.findById(id).populate("owner");
  // 백엔드 구간에서는 항상 안되는 경우를 생각해야 함
  if (!video) {
    return res.status(404).render("404", { pageTitle: "비디오 없음" });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  // 백엔드 구간에서는 항상 안되는 경우를 생각해야 함
  if (!video) {
    return res.status(404).render("404", { pageTitle: "비디오 없음" });
  }
  // 접근 권한이 없는 놈들에겐 403을 선사
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: { user: _id },
  } = req;
  // findById(id)와 exists({ _id: id})는 차이가 있음
  // exists는 id에 맞는 데이터를 찾은 다음 boolean을 return
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "비디오 없음." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags.split(",").map((word) => `#${word}`),
  });
  return res.redirect(`/videos/${id}`);
};

export const getDeleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "비디도 없음." });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
