import express from "express";
import {
  postLogout,
  getUserData,
  getUserVideos,
  postEditUser,
} from "../controllers/userController.js";
import {
  privateMiddleware,
  publicMiddleware,
  uploadImageMiddleware,
} from "../middleware.js";

const userRouter = express.Router();

// api/user/url
userRouter.post("/logout", privateMiddleware, postLogout);
userRouter.get("/:id([0-9a-f]{24})", getUserData);
userRouter.get("/:id([0-9a-f]{24})/videos", getUserVideos);
userRouter.post(
  "/:id([0-9a-f]{24})/edit",
  uploadImageMiddleware.single("avatar"),
  privateMiddleware,
  postEditUser
);

export default userRouter;
