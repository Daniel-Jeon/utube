import express from "express";
import cors from "cors";
import apiRouter from "./routers/apiRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

export default app;
