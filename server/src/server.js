import cors from "cors";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middleware";

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
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
  })
);
app.use(localsMiddleware);

app.use("/api", apiRouter);

export default app;
