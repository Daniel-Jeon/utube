import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  getSession,
  postUpload,
  getVideos,
  postVerifyVideoOwnership,
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
apiRouter.post("/video/:id([0-9a-f]{24})", postVerifyVideoOwnership);
apiRouter.get("/videos", getVideos);
apiRouter.get("/session", getSession);

export default apiRouter;
