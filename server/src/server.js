import express from "express";
import session from "express-session";
import cors from "cors";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "what you gonna do?",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/utube" }),
  })
);
app.use((req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "U tube";
  res.locals.user = req.session.user;
  next();
});

app.use("/api", apiRouter);

export default app;
