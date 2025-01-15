import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3VideoStorage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `videos/${req.session.user.id}/${Date.now().toString()}`);
  },
});

const s3ImageStorage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `images/${req.session.user.id}/${Date.now().toString()}`);
  },
});

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
  limits: { fileSize: 10 * 1024 * 1024 },
  storage: s3VideoStorage,
});

export const uploadImageMiddleware = multer({
  limits: { fileSize: 1 * 1024 * 1024 },
  storage: s3ImageStorage,
});

/*
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
*/
