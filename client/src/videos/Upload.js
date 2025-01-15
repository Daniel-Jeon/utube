import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const [upload, setUpload] = useState({
    video: null,
    thumbnail: null,
    title: "",
    description: "",
    hashtags: "",
  });
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "video" || name === "thumbnail") {
      console.log(`${name} 파일 선택됨:`, files[0]);
      setUpload((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setUpload((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    console.log("현재 상태:", upload);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!upload.video || !upload.thumbnail) {
      alert("영상과 썸네일을 모두 업로드해야 합니다.");
      return;
    }
    const formData = new FormData();
    formData.append("video", upload.video);
    formData.append("thumbnail", upload.thumbnail);
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
        {/* 비디오 파일 업로드 */}
        <div className="flex items-center space-x-4">
          <label className="text-lg font-medium w-32" htmlFor="video">
            영상 파일
          </label>
          <input
            type="file"
            name="video"
            id="video"
            onChange={handleChange}
            accept="video/*"
            required
            className="flex-1 border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* 썸네일 이미지 업로드 */}
        <div className="flex items-center space-x-4">
          <label className="text-lg font-medium w-32" htmlFor="thumbnail">
            썸네일 이미지
          </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            onChange={handleChange}
            accept="image/*"
            required
            className="flex-1 border border-gray-300 rounded-lg p-3"
          />
        </div>
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
