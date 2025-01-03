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
  getUserVideos,
  getUserData,
  postEditUser,
  getSearchVideos,
} from "../controllers/apiController";
import {
  privateMiddleware,
  publicMiddleware,
  uploadImageMiddleware,
  uploadVideoMiddleware,
} from "../middleware";

const apiRouter = express.Router();

apiRouter.get("/session", getSession);
apiRouter.post("/join", publicMiddleware, postJoin);
apiRouter.post("/login", publicMiddleware, postLogin);
apiRouter.post("/logout", privateMiddleware, postLogout);

apiRouter.post(
  "/upload",
  privateMiddleware,
  uploadVideoMiddleware.single("video"),
  postUpload
);
apiRouter.get("/video/:id([0-9a-f]{24})", getVideoData);
apiRouter.post("/video/:id([0-9a-f]{24})", postConfirmOwner);
apiRouter.delete("/video/:id([0-9a-f]{24})/delete", deleteVideo);
apiRouter.post("/video/:id([0-9a-f]{24})/edit", postEditVideo);
apiRouter.get("/videos", getVideos);
apiRouter.get("/search", getSearchVideos);

apiRouter.get("/user/:id([0-9a-f]{24})", getUserData);
apiRouter.post(
  "/user/:id([0-9a-f]{24})/edit",
  uploadImageMiddleware.single("avatar"),
  postEditUser
);
apiRouter.get("/user/:id([0-9a-f]{24})/videos", getUserVideos);

export default apiRouter;
