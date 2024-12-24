import { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import { UserContext } from "./contexts/User";
import Join from "./users/Join";
import Login from "./users/Login";
import Upload from "./videos/Upload";

const Private = ({ element }) => {
  const { user } = useContext(UserContext);
  if (user === null) return null;
  if (!user) return <Navigate to="/login" replace />;
  return element;
};

const Public = ({ element }) => {
  const { user } = useContext(UserContext);
  if (user === null) return null;
  if (user) return <Navigate to="/" replace />;
  return element;
};

function App() {
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    try {
      const fetchSession = async () => {
        const response = await fetch("http://localhost:4000/api/session", {
          credentials: "include",
        });
        const json = await response.json();
        if (!json.success) return;
        setUser(json.user);
      };
      fetchSession();
    } catch (error) {
      console.error("에러 발생", error);
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Public element={<Join />} />} />
          <Route path="/login" element={<Public element={<Login />} />} />
          <Route
            path="/video/upload"
            element={<Private element={<Upload />} />}
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
