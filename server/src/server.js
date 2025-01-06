import cors from "cors";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "what you gonna do?",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/utube" }),
  })
);
app.use(localsMiddleware);

app.use("/api", rootRouter);
app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);

export default app;
