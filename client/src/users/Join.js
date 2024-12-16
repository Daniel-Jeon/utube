import { useState } from "react";
import { useNavigate } from "react-router";

const Join = () => {
  const navigate = useNavigate();

  const [joinData, setJoinData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    location: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJoinData(
      (prevState) => ({ ...prevState, [name]: value })
      //console.log("joinData:", joinData)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await fetch("http://localhost:4000/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinData),
      });
      console.log("data:", data);
      const json = await data.json();
      if (json.message) {
        alert(json.message);
        navigate("/");
      }
    } catch (error) {
      console.log("Join Erorr:", error);
      alert("회원가입중 오류가 발생하였습니다.");
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="아이디(메일형식으로 입력)"
        name="email"
        value={joinData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="비밀번호"
        name="password"
        value={joinData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        name="confirmPassword"
        value={joinData.confirmPassword}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="닉네임"
        name="nickname"
        value={joinData.nickname}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="거주지역"
        name="location"
        value={joinData.location}
        onChange={handleChange}
      />
      <button>회원가입</button>
    </form>
  );
};

export default Join;
