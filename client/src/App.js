import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Join from "./users/Join";
import Login from "./users/Login";
import Upload from "./videos/Upload";
import { UserContext } from "./contexts/User";
import Video from "./videos/Video";
import EditVideo from "./videos/EditVideo";
import Profile from "./users/Profile";
import EditUser from "./users/EditUser";

const App = () => {
  const { user } = useContext(UserContext);
  return (
    <BrowserRouter>
      <Header user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={!user && <Join />} />
          <Route path="/login" element={!user && <Login />} />

          <Route path="/user/:id" element={<Profile />} />
          <Route path="/user/:id/edit" element={<EditUser />} />

          <Route path="/video/:id" element={<Video />} />
          <Route path="/video/upload" element={user && <Upload />} />
          <Route path="/video/:id/edit" element={user && <EditVideo />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
