import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/User";
import { useNavigate } from "react-router";

const Upload = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("http://localhost:4000/api/session", {
        credentials: "include",
      });
      const json = await response.json();
      if (!json.success) return;
      setUser(json);
    };
    fetchSession();
  }, [setUser]);
  const [upload, setUpload] = useState({
    video: null,
    title: "",
    description: "",
    hashtags: "",
  });
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "video") {
      setUpload((prevState) => ({
        ...prevState,
        video: files[0],
      }));
    } else {
      setUpload((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!upload.video) {
      alert("업로드한 파일이 없습니다.");
      return;
    }
    const formData = new FormData();
    formData.append("video", upload.video);
    formData.append("title", upload.title);
    formData.append("description", upload.description);
    formData.append("hashtags", upload.hashtags);
    try {
      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = await response.json();
      alert(json.message);
      if (!json.success) return;
      navigate(`/video/${json.id}`);
    } catch (error) {
      alert("업로드중 오류가 발생했습니다.\n", error);
      console.log("handleSubmit:", error);
    }
  };
  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="file"
          name="video"
          onChange={handleChange}
          accept="video/*"
        />
        <input
          type="text"
          placeholder="영상 제목"
          name="title"
          value={upload.title}
          onChange={handleChange}
        />
        <textarea
          placeholder="영상 설명"
          name="description"
          value={upload.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="#해시태그 ,를 사용하여 구분"
          name="hashtags"
          value={upload.hashtags}
          onChange={handleChange}
        />
        <button>업로드</button>
      </form>
    </>
  );
};

export default Upload;
