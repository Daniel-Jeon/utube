import mongoose from "mongoose";

// mongodb와 nodejs를 연결하기 위해 mongoose를 사용
mongoose.connect("mongodb://127.0.0.1:27017/project1");
const db = mongoose.connection;

// https://mongoosejs.com/docs/connections.html#connection-events
db.once("on", (error) => console.log(error));
db.once("open", () => console.log("DB Connected"));
