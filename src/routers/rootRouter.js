import express from "express";
import { home } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

// url을 관리하기 위해 router를 사용
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

// index에서 사라졌으니 쓸수 있게
export default rootRouter;
