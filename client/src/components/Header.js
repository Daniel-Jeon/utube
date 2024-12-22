import { NavLink, useNavigate } from "react-router";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const json = await (
        await fetch("http://localhost:4000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          credentials: "include",
        })
      ).json();
      alert(json.message);
      if (!json.success) navigate("/login");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("logout error:", error);
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
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
