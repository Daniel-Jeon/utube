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

export const postLogout = (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "잘못된 접근입니다.", success: false });
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

export const getSession = async (req, res) => {
  const { user } = req.session;
  return !user
    ? res.status(401).json({ message: "접근 권한이 없습니다.", success: false })
    : res.status(200).json({ user, success: true });
};

export const postUpload = async (req, res) => {
  const {
    file: { path: filepath },
    body: { title, description, hashtags },
    session,
  } = req;
  if (!session || !session.user)
    return res
      .status(401)
      .json({ message: "로그인이 필요합니다.", success: false });
  if (!req.file)
    return res
      .status(400)
      .json({ message: "업로드한 파일이 없습니다.", success: false });
  try {
    const videoData = await Video.create({
      filepath,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: session.user.id,
    });
    //console.log(typeof videoData._id);
    const userData = await User.findById(session.user.id);
    userData.videos.push(videoData._id);
    userData.save();
    return res
      .status(201)
      .json({ message: "성공", success: true, video: videoData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "업로드에 실패했습니다.", success: false });
  }
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

export const getVideoData = async (req, res) => {
  const { id } = req.params;
  const videoData = await Video.findById(id).populate(
    "owner",
    "-password -createdAt"
  );
  if (!videoData)
    return res
      .status(404)
      .json({ message: "영상이 존재하지 않습니다.", success: false });
  return res.status(200).json({ success: true, videoData });
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

export const postConfirmOwner = async (req, res) => {
  const {
    body: userData,
    params: { id: videoId },
  } = req;
  try {
    const videoData = await Video.findById(videoId);
    if (!(String(videoData.owner) === String(userData.id)))
      return res.status(403).json({ success: false });
    return res.status(200).json({ success: true, videoData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류", success: false });
  }
};

export const deleteVideo = async (req, res) => {
  const { id: userId } = req.session.user;
  const { id: videoId } = req.params;
  try {
    const confirmOwner = await Video.findById(videoId);
    if (!confirmOwner)
      return res
        .status(404)
        .json({ message: "영상이 존재하지 않습니다.", success: false });
    if (String(confirmOwner.owner) !== String(userId))
      return res
        .status(403)
        .json({ message: "권한이 없습니다.", success: false });
    await Video.deleteOne({ _id: videoId });
    return res
      .status(200)
      .json({ message: "영상이 삭제되었습니다.", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "삭제 중 에러 발생\n잠시후 다시 시도하세요.",
      success: false,
    });
  }
};

export const postEditVideo = async (req, res) => {
  const { _id: videoId, title, description, hashtags } = req.body;
  const { id: userId } = req.session.user;
  console.log(typeof hashtags);
  if (String(videoId) !== String(req.params.id))
    return res.status(403).json({
      message: "영상 정보가 맞지 않습니다.\n홈으로 이동합니다.",
      success: false,
    });
  try {
    const videoData = await Video.findById(videoId);
    if (!videoData)
      return res
        .status(404)
        .json({ message: "영상이 존재하지 않습니다.", success: false });
    if (String(userId) !== String(videoData.owner))
      return res.status(403).json({
        message: "영상 정보가 맞지 않습니다.\n홈으로 이동합니다.",
        success: false,
      });
    await Video.updateOne(
      { _id: videoId },
      {
        $set: {
          title,
          description,
          hashtags: Video.formatHashtags(hashtags),
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "영상정보가 수정되었습니다.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "업데이트 도중 오류가 발생하였습니다.\n잠시 후 다시 시도하세요.",
      success: false,
    });
  }
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
    const userData = await User.findOne({ _id: user.id }).select("-videos");
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
      avatar: file ? file.path : "",
      nickname,
      location,
    };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user.id }, updateData, { new: true });
    return res.status(200).json({
      message: "유저 정보가 변경되었습니다.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "서버 오류 발생\n잠시후 다시 시도하세요.",
    });
  }
};
