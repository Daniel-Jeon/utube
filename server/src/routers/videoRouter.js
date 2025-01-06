import express from "express";
import {
  postUpload,
  getVideoData,
  postConfirmOwner,
  deleteVideo,
  postEditVideo,
  postEditVideoMeta,
} from "../controllers/videoController";
import {
  privateMiddleware,
  publicMiddleware,
  uploadVideoMiddleware,
} from "../middleware";

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

export default videoRouter;
