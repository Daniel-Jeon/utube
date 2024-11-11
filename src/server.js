import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";

// express application을 생성
const app = express();

// express는 view engine이 없으며, 우리는 pug을 사용
app.set("view engine", "pug");
// default는 현재 경로의 views를 추적(src/index.js)
// 경로를 프로젝트폴더/src/views로 수정해줘야 함
app.set("views", process.cwd() + "/src/views");

// log 확인을 위해 morgan 사용
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", rootRouter);
app.use("/videos", videoRouter);

export default app;
