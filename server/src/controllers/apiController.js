import User from "../models/User";

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword, nickname, location } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .stats(400)
      .json({
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
    return res.status(200).json({ message: "회원가입성공", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "회원가입 도중 오류가 발생했습니다.", success: false });
  }
};
