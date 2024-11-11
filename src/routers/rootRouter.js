import express from "express";
import { home } from "../controllers/videoController";

// url을 관리하기 위해 router를 사용
const rootRouter = express.Router();

rootRouter.get("/", home);

// index에서 사라졌으니 쓸수 있게
export default rootRouter;
