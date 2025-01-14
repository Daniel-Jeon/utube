import "./config.js";
import "./db.js";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware.js";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    ...(process.env.NODE_ENV === "production"
      ? { cookie: { secure: true, sameSite: "none" } }
      : {}),
  })
);
app.use(localsMiddleware);

app.use("/api", rootRouter);
app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);

app.listen(process.env.PORT, "0.0.0.0", () =>
  console.log("✅ Server Connected ✅")
);

console.log(process.env.NODE_ENV);
