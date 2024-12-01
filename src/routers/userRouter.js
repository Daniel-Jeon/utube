import express from "express";
import {
  finishGithubLogin,
  startGithubLogin,
  logout,
  startKakaoLogin,
  finishKakaoLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/logout", logout);

export default userRouter;
