import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "U tube";
  res.locals.user = req.session.user;
  next();
};

export const uploadMiddleware = multer({ dest: "uploads/" });
