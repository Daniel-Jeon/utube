import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";
import userRouter from "./routers/userRouter";

// express application을 생성
const app = express();

// express는 view engine이 없으며, 우리는 pug을 사용
app.set("view engine", "pug");
// default는 현재 경로의 views를 추적(src/index.js)
// 경로를 프로젝트폴더/src/views로 수정해줘야 함
app.set("views", process.cwd() + "/src/views");

// log 확인을 위해 morgan 사용
app.use(morgan("dev"));
// 브라우저가 request를 보내면 데이터 타입을 변경해주는 미들웨어
// 이걸 통해 req.body나 req.query 같은 것들을 사용할수 있음
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    // 세션이 변경될때만 생성
    resave: false,
    saveUninitialized: false,
    // 세션을 메모리가 아닌 db에 저장
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
