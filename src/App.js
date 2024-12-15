import { Link, BrowserRouter as Router } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Footer = () => {
  return <footer>&copy; Daniel. All rights reserved.</footer>;
};

const Layout = () => {
  return <span>내용잘나오지?</span>;
};

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Layout />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
