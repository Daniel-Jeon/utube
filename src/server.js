import express from "express";
import rootRouter from "./routers/rootRouter";

/*
    express server 연결하는 곳
*/

// express application을 생성
const app = express();

// express는 view engine이 없으며, 우리는 pug을 사용
app.set("view engine", "pug");
// default는 현재 경로의 views를 추적(src/index.js)
// 경로를 프로젝트폴더/src/views로 수정해줘야 함
app.set("views", process.cwd() + "/src/views");

app.get("/", rootRouter);

export default app;
