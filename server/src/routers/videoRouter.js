import express from "express";
import {
  postUpload,
  getVideoData,
  postConfirmOwner,
  deleteVideo,
  postEditVideo,
  postEditVideoMeta,
  postVideoComment,
  getComments,
  deleteComment,
} from "../controllers/videoController.js";
import {
  privateMiddleware,
  publicMiddleware,
  uploadVideoMiddleware,
} from "../middleware.js";

const videoRouter = express.Router();

// api/video/url
videoRouter.post(
  "/upload",
  privateMiddleware,
  uploadVideoMiddleware.single("video"),
  postUpload
);
videoRouter.get("/:id([0-9a-f]{24})", getVideoData);
videoRouter.post("/:id([0-9a-f]{24})", postConfirmOwner);
videoRouter.delete("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.post("/:id([0-9a-f]{24})/edit", postEditVideo);
videoRouter.post("/:id([0-9a-f]{24})/meta", postEditVideoMeta);
videoRouter.post("/:id([0-9a-f]{24})/comment", postVideoComment);
videoRouter.get("/:id([0-9a-f]{24})/comments", getComments);
videoRouter.delete(
  "/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})",
  deleteComment
);

export default videoRouter;
