import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, uniqued: true },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true },
  nickname: { type: String, required: true, uniqued: true },
});

// 보안을 위해 bcrypt를 사용하여 비밀번호 해싱화
// pre는 mongoose 미들웨어
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;
