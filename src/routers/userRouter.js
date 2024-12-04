import express from "express";
import {
  finishGithubLogin,
  startGithubLogin,
  logout,
  startKakaoLogin,
  finishKakaoLogin,
  profile,
  getEdit,
  postEdit,
  getEditPassword,
  postEditPassword,
} from "../controllers/userController";
import {
  protectMiddleware,
  socialLoginMiddleware,
  uploadFiles,
} from "../middleware";

const userRouter = express.Router();

// /users/-->
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/logout", protectMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
userRouter
  .route("/edit/password")
  .all(protectMiddleware, socialLoginMiddleware)
  .get(getEditPassword)
  .post(postEditPassword);
userRouter.get("/:id([0-9a-f]{24})", protectMiddleware, profile);

export default userRouter;
