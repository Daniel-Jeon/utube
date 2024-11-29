import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword, nickname } = req.body;
  // 닉네임도 나중에 이벤트로 처리하는게 좋을거 같음
  // exists에 연산자를 사용할 수 있다는걸 기억하는게 좋음
  const exists = await User.exists({ $or: [{ email }, { nickname }] });
  if (exists) {
    return res.status(400).render("login", {
      errorMessage: "회원가입된 계정이 존재합니다.",
    });
  }
  // 나중에 프론트에서 이벤트로 비밀번호 확인
  if (password !== confirmPassword) {
    return res
      .status(400)
      .render("join", { errorMessage: "비밀번호가 틀립니다." });
  }
  try {
    await User.create({
      email,
      password,
      nickname,
    });
    return res.redirect("/login");
  } catch (error) {
    // 계정생성시에도 에러가 발생할 수 있음
  }
};

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .render("login", { errorMessage: "계정이 존재하지 않습니다." });
  }
  const confirm = await bcrypt.compare(password, user.password);
  if (!confirm) {
    return res
      .status(400)
      .render("login", { errorMessage: "비밀번호가 틀립니다." });
  }
  return res.redirect("/");
};
