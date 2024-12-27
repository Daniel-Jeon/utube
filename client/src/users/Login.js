import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = loginData;
    if (email === "" || password === "") {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }
    try {
      const data = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const json = await data.json();
      alert(json.message);
      if (!json.success) return;
      setUser(json.user);
      navigate("/");
    } catch (error) {
      console.log("Login Error:", error);
      alert("로그인중 오류가 발생하였습니다.");
    }
  };
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <input
        placeholder="이메일을 입력하세요."
        type="email"
        name="email"
        value={loginData.email}
        onChange={handleChange}
      />
      <input
        placeholder="비밀번호를 입력하세요."
        type="password"
        name="password"
        value={loginData.password}
        onChange={handleChange}
      />
      <button>로그인</button>
    </form>
  );
};

export default Login;
