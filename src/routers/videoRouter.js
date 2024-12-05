import express from "express";
import {
  watch,
  getUploadVideo,
  postUploadVideo,
  getEditVideo,
  postEditVideo,
  getDeleteVideo,
} from "../controllers/videoController";
import { protectMiddleware, videoUpload } from "../middleware";

const videoRouter = express.Router();
// /videos/-->
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectMiddleware, getDeleteVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleware)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUploadVideo)
  .post(videoUpload.single("video"), postUploadVideo);

export default videoRouter;
