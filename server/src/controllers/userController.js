import User from "../models/User.js";
import Video from "../models/Video.js";
import bcrypt from "bcrypt";

export const postLogout = (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "접근 권한이 없습니다..", success: false });
  }
  req.session.destroy((error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "로그아웃에 실패했습니다.", success: false });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "로그아웃합니다.", success: true });
  });
};

export const getUserData = async (req, res) => {
  const { user } = req.session;
  const paramsId = req.params.id;
  try {
    if (String(user.id) !== String(paramsId))
      return res
        .status(403)
        .json({ message: "유저 정보가 일치하지 않습니다.", success: false });
    const userData = await User.findById(user.id).select("-videos -password");
    if (!userData)
      return res
        .status(404)
        .json({ message: "유저 정보가 없습니다.", success: false });
    return res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류", success: false });
  }
};

export const getUserVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "유저 정보를 찾을 수 없습니다.", success: false });
    const videos = await Video.find({ owner: id })
      .sort({
        createdAt: "desc",
      })
      .populate("owner");
    return videos
      ? res.status(200).json({ success: true, videos, user })
      : res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류", success: false });
  }
};

export const postEditUser = async (req, res) => {
  const { user } = req.session;
  const { currentPassword, password, confirmPassword, nickname, location } =
    req.body;
  const { file } = req;
  if (password !== confirmPassword)
    return res.status(400).json({ message: "새 비밀번호가 맞지 않습니다." });
  if (
    (password || confirmPassword) &&
    (password === "" || confirmPassword === "")
  )
    return res.status(401).json({ message: "비밀번호가 입력되지 않았습니다." });
  try {
    let userData = await User.findOne({ _id: user.id }).select("-videos");
    if (!userData)
      return res
        .status(404)
        .json({ message: "유저 정보가 존재하지 않습니다." });
    const comparePassword = await bcrypt.compare(
      currentPassword,
      userData.password
    );
    if (!comparePassword) {
      return res
        .status(401)
        .json({ message: "기존 비밀번호와 맞지 않습니다." });
    }
    const updateData = {
      avatar: file ? file.location : "",
      nickname,
      location,
    };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user.id }, updateData, { new: true });
    userData = await User.findOne({ _id: user.id }).select("-videos");
    console.log(userData);
    req.session.user = {
      id: userData._id,
      email: userData.email,
      nickname: userData.nickname,
      avatar: userData.avatar,
    };
    return res.status(200).json({
      message: "유저 정보가 변경되었습니다.",
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "서버 오류 발생\n잠시후 다시 시도하세요.",
    });
  }
};
