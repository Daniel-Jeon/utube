import dotenv from "dotenv";

// NODE_ENV 값에 따라 환경 파일 설정
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });
