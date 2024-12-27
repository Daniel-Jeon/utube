import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      alert(json.message);
      if (!json.success) navigate("/login");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("logout error:", error);
      alert("로그아웃 중 문제가 발생했습니다.\n", error);
    }
  };
  return (
    <header>
      <nav>
        <li>
          <NavLink to="/">HOME</NavLink>
        </li>
        {!user ? (
          <>
            <li>
              <NavLink to="/join">JOIN</NavLink>
            </li>
            <li>
              <NavLink to="/login">LOGIN</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/users/profile">{user.nickname} PROFILE</NavLink>
            </li>
            <li>
              <NavLink to="#" onClick={handleLogout}>
                LOGOUT
              </NavLink>
            </li>
            <li>
              <NavLink to="/video/upload">UPLOAD</NavLink>
            </li>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
