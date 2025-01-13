import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
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
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/video/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const json = await response.json();
      console.log(json);
      alert(json.message);
      if (!json.success) return;
      navigate("/video/" + json.video._id, { state: { video: json.video } });
    } catch (error) {
      alert("업로드중 오류가 발생했습니다.\n", error);
      console.error("handleSubmit:", error);
    }
  };
  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">영상 업로드</h1>
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        <input
          type="file"
          name="video"
          onChange={handleChange}
          accept="video/*"
          required
          className="block w-full border border-gray-300 rounded-lg p-3"
        />
        <input
          type="text"
          placeholder="영상 제목"
          name="title"
          value={upload.title}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <textarea
          placeholder="영상 설명"
          name="description"
          value={upload.description}
          onChange={handleChange}
          required
          className="block w-full h-32 border border-gray-300 rounded-lg p-3 resize-none"
        ></textarea>
        <input
          type="text"
          placeholder="#해시태그 ,를 사용하여 구분"
          name="hashtags"
          value={upload.hashtags}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <button className="w-full bg-blue-500 font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-white">
          업로드
        </button>
      </form>
    </div>
  );
};

export default Upload;
