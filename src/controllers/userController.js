import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { email, password, confirmPassword, nickname, nation } = req.body;
  // 닉네임도 나중에 이벤트로 처리하는게 좋을거 같음
  // exists에 연산자를 사용할 수 있다는걸 기억하는게 좋음
  const exists = await User.exists({ $or: [{ email }, { nickname }] });
  if (exists) {
    return res.status(400).render("join", {
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
      nation,
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
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  return res.redirect(`${baseUrl}?${params}`);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const tokenRequest = await (
    await fetch(`${baseUrl}?${params}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `bearer ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `bearer ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        password: "",
        nickname: userData.login,
        socialOnly: true,
        nation: "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    response_type: "code",
  };
  const parameters = new URLSearchParams(config).toString();
  return res.redirect(`${baseUrl}?${parameters}`);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    code: req.query.code,
  };
  const parameters = new URLSearchParams(config).toString();
  const token = await (
    await fetch(`${baseUrl}?${parameters}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  const userData = await (
    await fetch("https://kapi.kakao.com/v2/user/me", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  const userEmail = userData.kakao_account.email;
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    user = await User.create({
      email: userData.kakao_account.email,
      password: "",
      nickname: userData.kakao_account.profile.nickname,
      nation: "",
      socialOnly: true,
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const profile = async (req, res) => {
  // 내 프로필이라도 모든 유저가 봐야함으로 id를 가져올때 세션이 아닌 파라미터에서 가져옴
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    options: { sort: { createdAt: -1 } },
  });
  if (!user) {
    return res
      .status(404)
      .render("404", { errorMessage: "해당 유저가 없습니다." });
  }
  return res.render("users/profile", {
    pageTitle: user.nickname,
    user,
  });
};

export const getEdit = (req, res) => {
  return res.render("users/edit");
};

export const postEdit = async (req, res) => {
  const {
    session: { user: _id, avatarUrl },
    body: { nickname, nation },
    file,
  } = req;
  const updateUser = await User.findOneAndUpdate(
    _id,
    { nickname, nation, avatarUrl: file ? file.path : avatarUrl },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getEditPassword = (req, res) => {
  return res.render("users/password", { pageTitle: "비밀번호 변경" });
};

export const postEditPassword = async (req, res) => {
  const { pageTitle } = "비밀번호 변경";
  const renderUrl = "users/password";
  const {
    body: { currentPassword, changePassword, confirmPassword },
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).render(renderUrl, {
      errorMessage: "유저 정보가 없습니다.",
      pageTitle,
    });
  }
  const check = await bcrypt.compare(currentPassword, user.password);
  if (!check) {
    return res.status(400).render(renderUrl, {
      errorMessage: "기존 비밀번호와 맞지 않습니다.",
      pageTitle,
    });
  }
  if (changePassword !== confirmPassword) {
    return res.status(400).render(renderUrl, {
      errorMessage: "변경할 비밀번호가 맞지 않습니다.",
      pageTitle,
    });
  }
  user.password = changePassword;
  await user.save();
  return res.redirect("/users/logout");
};
