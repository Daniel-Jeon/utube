import express from "express";
import {
  postJoin,
  postLogin,
  getSession,
  getVideos,
  getSearchVideos,
} from "../controllers/rootController";
import { privateMiddleware, publicMiddleware } from "../middleware";

const rootRouter = express.Router();

// api
rootRouter.post("/join", publicMiddleware, postJoin);
rootRouter.post("/login", publicMiddleware, postLogin);
rootRouter.get("/session", getSession);
rootRouter.get("/videos", getVideos);
rootRouter.get("/search", getSearchVideos);

export default rootRouter;
