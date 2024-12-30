import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  getSession,
  postUpload,
  getVideos,
  getVideoData,
  postConfirmOwner,
  deleteVideo,
  postEditVideo,
} from "../controllers/apiController";
import {
  privateMiddleware,
  publicMiddleware,
  uploadMiddleware,
} from "../middleware";

const apiRouter = express.Router();

apiRouter.post("/join", publicMiddleware, postJoin);
apiRouter.post("/login", publicMiddleware, postLogin);
apiRouter.post("/logout", privateMiddleware, postLogout);
apiRouter.post(
  "/upload",
  privateMiddleware,
  uploadMiddleware.single("video"),
  postUpload
);
apiRouter.get("/video/:id([0-9a-f]{24})", getVideoData);
apiRouter.post("/video/:id([0-9a-f]{24})", postConfirmOwner);
apiRouter.delete("/video/:id([0-9a-f]{24})/delete", deleteVideo);
apiRouter.post("/video/:id([0-9a-f]{24})/edit", postEditVideo);
apiRouter.get("/videos", getVideos);
apiRouter.get("/session", getSession);

export default apiRouter;
