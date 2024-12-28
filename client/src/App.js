import { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Join from "./users/Join";
import Login from "./users/Login";
import Upload from "./videos/Upload";
import { UserContext } from "./contexts/User";
import Video from "./videos/Video";

const App = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return null;
  return (
    <BrowserRouter>
      <Header user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/join"
            element={user ? <Navigate to="/" replace /> : <Join />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/video/upload"
            element={user ? <Upload /> : <Navigate to="/login" replace />}
          />
          <Route path="/video/:id" element={<Video />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
