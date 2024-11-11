import Video from "../models/Video";

export const home = (req, res) => {
  // 나중에 여기에 모든 영화목록 나오게 할 예정
  return res.render("home", { pageTitle: "HOME" });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "UPLOAD" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "UPLOAD",
      errorMessage: error.message,
    });
  }
};
