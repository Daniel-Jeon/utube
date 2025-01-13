import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkPassword } from "../utils/validation";

const Join = () => {
  const navigate = useNavigate();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [joinData, setJoinData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    location: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJoinData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { password, confirmPassword } = joinData;
    if (!checkPassword(password, confirmPassword)) {
      passwordRef.current.focus();
      return;
    }
    try {
      const data = await fetch(process.env.REACT_APP_API_URL + "/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinData),
      });
      const json = await data.json();
      alert(json.message);
      if (!json.success) {
        if (json.tagname === "email") {
          emailRef.current.focus();
          return;
        }
      }
      navigate("/login");
    } catch (error) {
      console.log("Join Error:", error);
      alert("회원가입중 오류가 발생하였습니다.");
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">회원가입</h1>
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="아이디(메일형식으로 입력)"
          name="email"
          value={joinData.email}
          onChange={handleChange}
          required
          ref={emailRef}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="비밀번호"
          name="password"
          value={joinData.password}
          onChange={handleChange}
          required
          ref={passwordRef}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="confirmPassword"
          value={joinData.confirmPassword}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="닉네임"
          name="nickname"
          value={joinData.nickname}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="거주지역"
          name="location"
          value={joinData.location}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Join;
