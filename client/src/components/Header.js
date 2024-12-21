import { useEffect, useState } from "react";
import { NavLink } from "react-router";

const Header = ({ user }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await (
        await fetch("http://localhost:4000/api/session")
      ).json();
      setLoggedIn(data);
      console.log(data);
    };
    fetchData();
  }, []);

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
              <NavLink to="/logout">LOGOUT</NavLink>
            </li>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
