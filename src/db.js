import mongoose from "mongoose";

// mongodb와 nodejs를 연결하기 위해 mongoose를 사용
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

// https://mongoosejs.com/docs/connections.html#connection-events
db.once("on", (error) => console.log(error));
db.once("open", () => console.log("DB Connected"));
