import User from "../models/User";
import bcrypt from "bcrypt";

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword, nickname, location } = req.body;
  const existingUser = await User.findOne({ email });
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
  try {
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
        .json({ message: "입력하신 정보가 틀립니다.", success: false });
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

export const getSession = (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });
  return res.status(200).json({ user: req.session.user, success: true });
};
