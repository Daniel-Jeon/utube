import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import { UserContext } from "./contexts/User";
import Join from "./users/Join";
import Login from "./users/Login";
import { checkSession } from "./utils/auth";
import Upload from "./videos/Upload";

function App() {
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    const fetchSession = async () => {
      const json = await checkSession();
      setUser(json);
    };
    fetchSession();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/video/upload" element={<Upload />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
