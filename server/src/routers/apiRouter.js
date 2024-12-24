import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  getSession,
  postUpload,
} from "../controllers/apiController";
import { uploadMiddleware } from "../middleware";

const apiRouter = express.Router();

apiRouter.post("/join", postJoin);
apiRouter.post("/login", postLogin);
apiRouter.post("/logout", postLogout);
apiRouter.post("/upload", uploadMiddleware.single("video"), postUpload);
apiRouter.get("/session", getSession);

export default apiRouter;
