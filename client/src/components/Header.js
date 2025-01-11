import { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const searchBar = useRef();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      const json = await response.json();
      alert(json.message);
      if (!json.success) navigate("/login");
      navigate("/");
      setUser(null);
    } catch (error) {
      console.error("logout error:", error);
      alert("로그아웃 중 문제가 발생했습니다.\n", error);
    }
  };
  const handleChange = (event) => {
    setSearch(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!search || search === "") {
      alert("검색어를 입력하세요.");
      searchBar.current.focus();
      return;
    }
    navigate(`/search?keyword=${search.trim()}`);
    setSearch("");
  };
  return (
    <header>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center list-none">
          <li>
            <NavLink to="/">HOME</NavLink>
          </li>
          <form onSubmit={handleSubmit} className="flex w-1/3">
            <input
              type="text"
              name="search"
              className="rounded-l-full h-10 w-11/12 pl-4 text-black"
              value={search}
              onChange={handleChange}
              ref={searchBar}
            />
            <div
              onClick={handleSubmit}
              className="bg-white rounded-r-full flex items-center"
            >
              <img
                className="h-8"
                src="https://cdn0.iconfinder.com/data/icons/ikonate/48/search-64.png"
                alt=""
              />
            </div>
          </form>
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
                <NavLink to={`/user/${user.id}`}>
                  {user.nickname} PROFILE
                </NavLink>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
