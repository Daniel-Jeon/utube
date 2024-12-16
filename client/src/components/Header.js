import { NavLink } from "react-router";

const Header = () => {
  return (
    <header>
      <nav>
        <li>
          <NavLink to="/">HOME</NavLink>
        </li>
        <li>
          <NavLink to="/join">JOIN</NavLink>
        </li>
      </nav>
    </header>
  );
};

export default Header;
