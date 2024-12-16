import express from "express";
import cors from "cors";
import "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/join", (req, res) => {
  const data = req.body;
  console.log(data);
  return res.status(200).json({ message: "회원가입성공" });
});

app.listen(4000, () => console.log("Server Connected."));
