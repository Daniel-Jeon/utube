import multer from "multer";
import path from "path";

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

export const uploadVideoMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/videos");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        req.session.user.id + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadImageMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/images");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        req.session.user.id + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 1 * 1024 * 1024 },
});
