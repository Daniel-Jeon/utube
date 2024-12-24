import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  getSession,
  postUpload,
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
apiRouter.get("/session", getSession);

export default apiRouter;
