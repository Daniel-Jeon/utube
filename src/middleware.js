// 세션관리
export const localsMiddleware = (req, res, next) => {
  console.log("req.session:", req.session);
  res.locals.siteName = "PROJECT1";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  //console.log(res.locals);
  next();
};

// 로그인을 하지 않은 유저들만 접근
export const publicMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

// 로그인을 한 유저들만 접근
export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

// 소셜로그인 유저가 비밀번호 변경페이지에 접근하지 못하게 함
export const socialLoginMiddleware = (req, res, next) => {
  if (req.session.user.socialOnly) {
    return res.redirect("/");
  } else {
    next();
  }
};
