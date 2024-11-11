import express from "express";
import { getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", getUpload);
videoRouter.post("/upload", postUpload);

export default videoRouter;
