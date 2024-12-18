import express from "express";
import { postJoin } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.post("/join", postJoin);

export default apiRouter;
