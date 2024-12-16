import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/utube");

const db = mongoose.connection;

db.on("error", (error) => console.log("db error:", error));
db.once("open", () => console.log("DB Connected."));
