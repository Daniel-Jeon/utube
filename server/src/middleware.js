import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "U tube";
  res.locals.user = req.session.user || null;
  next();
};

export const privateMiddleware = (req, res, next) => {
  if (!req.session || !req.session.user)
    return res.status(401).json({
      message: "로그인이 필요합니다.",
      success: false,
    });
  next();
};

export const publicMiddleware = (req, res, next) => {
  if (req.session.user)
    return res.status(401).json({
      message: "잘못된 접근입니다.",
      success: false,
    });
  next();
};

export const uploadMiddleware = multer({ dest: "uploads/" });
