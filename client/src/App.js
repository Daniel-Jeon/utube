import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Join from "./users/Join";
import Login from "./users/Login";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const json = await (
          await fetch("http://localhost:4000/api/session", {
            credentials: "include",
          })
        ).json();
        if (json.success) setUser(json.user);
      } catch (error) {
        console.log("세션 에러", error);
      }
    };
    fetchSession();
  }, []);

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
