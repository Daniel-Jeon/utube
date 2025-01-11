import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword, nickname, location } = req.body;
  const existingUser = await User.findOne({ email });
  try {
    if (existingUser) {
      return res.status(400).json({
        message: "계정이 이미 존재합니다.",
        success: false,
        tagname: "email",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "비밀번호가 맞지 않습니다.", success: false });
    }
    await User.create({
      email,
      password,
      nickname,
      location,
    });
    return res.status(201).json({ message: "회원가입성공", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
      success: false,
    });
  }
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(401)
        .json({ message: "계정정보가 없습니다.", success: false });
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!comparePassword) {
      return res
        .status(401)
        .json({ message: "입력하신 정보가 틀립니다.", success: false });
    }
    req.session.loggedIn = true;
    req.session.user = {
      id: existingUser._id,
      email: existingUser.email,
      nickname: existingUser.nickname,
      avatar: existingUser.avatar,
    };
    return res.status(200).json({
      message: "로그인 성공하였습니다.",
      success: true,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
      success: false,
    });
  }
};

export const getSession = async (req, res) => {
  const { user } = req.session;
  return !user
    ? res.status(401).json({ message: "접근 권한이 없습니다.", success: false })
    : res.status(200).json({ user, success: true });
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner", "-password -createdAt");
    return videos
      ? res.status(200).json({ success: true, videos })
      : res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류", success: false });
  }
};

export const getSearchVideos = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword)
    return res.status(400).json({
      message: "검색어를 입력하세요.",
    });
  try {
    const searchVideos = await Video.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate("owner", "_id email nickname avatar")
      .select("-__v");
    if (!searchVideos) return res.status(204).json({ videos: searchVideos });
    return res.status(200).json({ videos: searchVideos });
  } catch (error) {
    console.error("getSearchVideos :", error);
    return res
      .status(500)
      .json({ message: "검색 중 서버 오류 발생\n잠시 후 다시 시도하세요." });
  }
};
