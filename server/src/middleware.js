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

const s3ThumbnailStorage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: "public-read",
  key: function (req, file, cb) {
    cb(null, `thumbnails/${req.session.user.id}/${Date.now().toString()}`);
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
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      const folder = file.fieldname === "video" ? "videos" : "thumbnails";
      cb(null, `${folder}/${req.session.user.id}/${Date.now().toString()}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      // 비디오 파일 필터링
      if (!file.mimetype.startsWith("video/")) {
        return cb(new Error("비디오 파일만 업로드 가능합니다."), false);
      }
    } else if (file.fieldname === "thumbnail") {
      // 썸네일 파일 필터링
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
      }
    }
    cb(null, true);
  },
  limits: {
    fileSize: (req, file, cb) => {
      if (file.fieldname === "video") {
        cb(null, 10 * 1024 * 1024);
      } else if (file.fieldname === "thumbnail") {
        cb(null, 1 * 1024 * 1024);
      }
    },
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const uploadImageMiddleware = multer({
  limits: { fileSize: 1 * 1024 * 1024 },
  storage: s3ImageStorage,
});
