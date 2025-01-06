import express from "express";
import {
  postLogout,
  getUserData,
  getUserVideos,
  postEditUser,
} from "../controllers/userController";
import {
  privateMiddleware,
  publicMiddleware,
  uploadImageMiddleware,
} from "../middleware";

const userRouter = express.Router();

// api/user/url
userRouter.post("/logout", privateMiddleware, postLogout);
userRouter.get("/:id([0-9a-f]{24})", getUserData);
userRouter.get("/:id([0-9a-f]{24})/videos", getUserVideos);
userRouter.post(
  "/:id([0-9a-f]{24})/edit",
  uploadImageMiddleware.single("avatar"),
  postEditUser
);

export default userRouter;
