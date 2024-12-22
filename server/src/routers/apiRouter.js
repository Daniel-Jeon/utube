import express from "express";
import {
  postJoin,
  postLogin,
  postLogout,
  getSession,
} from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.post("/join", postJoin);
apiRouter.post("/login", postLogin);
apiRouter.post("/logout", postLogout);
apiRouter.get("/session", getSession);

export default apiRouter;
