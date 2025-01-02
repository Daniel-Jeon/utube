import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkPassword } from "../utils/validation";
import { UserContext } from "../contexts/User";

const EditUser = () => {
  const { user } = useContext(UserContext);
  const params = useParams().id;
  const passwordRef = useRef("");
  const currentPasswordRef = useRef("");
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({
    avatar: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
    email: "",
    nickname: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`http://localhost:4000/api/user/${params}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const json = await response.json();
      if (json.message) alert(json.message);
      if (!json.success) {
        setUpdateData({
          avatar: "",
          email: "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
          nickname: "",
          location: "",
        });
        navigate("/");
        return;
      }
      setUpdateData({
        avatar: "",
        email: json.user.email,
        currentPassword: "",
        password: "",
        confirmPassword: "",
        nickname: json.user.nickname,
        location: json.user.location,
      });
    };
    fetchUserData();
  }, [user, params, navigate]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    console.log("change:", files);
    if (name === "avatar") {
      setUpdateData((prevState) => ({
        ...prevState,
        avatar: files[0],
      }));
    } else {
      setUpdateData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { password, confirmPassword } = updateData;
    if (!checkPassword(password, confirmPassword)) {
      passwordRef.current.focus();
      return;
    }
    const formData = new FormData();
    if (updateData.avatar === undefined) {
      formData.append("avatar", "");
    } else {
      formData.append("avatar", updateData.avatar);
    }
    formData.append("currentPassword", updateData.currentPassword);
    formData.append("password", updateData.password);
    formData.append("confirmPassword", updateData.confirmPassword);
    formData.append("nickname", updateData.nickname);
    formData.append("location", updateData.location);
    try {
      const response = await fetch(
        // 유저 정보 수정에는 세션정보가 적합하다고 생각
        `http://localhost:4000/api/user/${user.id}/edit`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const json = await response.json();
      alert(json.message);
      if (response.status === 400) {
        passwordRef.current.focus();
        return;
      } else if (response.status === 401) {
        currentPasswordRef.current.focus();
        return;
      }
      navigate(`/user/${user.id}`);
    } catch (error) {
      console.error("Join Error:", error);
      alert("회원가입중 오류가 발생하였습니다.");
    }
  };
  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">회원정보수정</h1>
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          accept="image/*"
          className="block w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="email"
          value={updateData.email}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
          disabled
        />
        <input
          type="password"
          placeholder="기존 비밀번호"
          name="currentPassword"
          value={updateData.currentPassword}
          onChange={handleChange}
          required
          ref={currentPasswordRef}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="비밀번호"
          name="password"
          value={updateData.password}
          onChange={handleChange}
          required
          ref={passwordRef}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="confirmPassword"
          value={updateData.confirmPassword}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="닉네임"
          name="nickname"
          value={updateData.nickname}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="거주지역"
          name="location"
          value={updateData.location}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-white"
        >
          정보수정
        </button>
      </form>
    </div>
  );
};

export default EditUser;
