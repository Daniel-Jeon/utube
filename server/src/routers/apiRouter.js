import express from "express";
import { postJoin, postLogin, getSession } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.post("/join", postJoin);
apiRouter.post("/login", postLogin);
apiRouter.get("/session", getSession);

export default apiRouter;
