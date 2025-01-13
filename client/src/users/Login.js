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
      const data = await fetch(process.env.REACT_APP_API_URL + "/api/login", {
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
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        <input
          placeholder="이메일을 입력하세요."
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          placeholder="비밀번호를 입력하세요."
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <button className="w-full bg-blue-500 font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300">
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
