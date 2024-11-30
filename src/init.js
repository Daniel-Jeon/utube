// .env를 사용해서 보안 유지
import "dotenv/config";
// db연결과 express server연결을 파일을 나누어 따로 진행
import "./db";
import app from "./server";

const PORT = 4000;

// application이 listening할 수 있게 만들기
app.listen(PORT, () => console.log(`URL : http://localhost:${PORT}`));
