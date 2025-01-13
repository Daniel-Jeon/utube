import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditVideo = () => {
  const [edit, setEdit] = useState({
    _id: "",
    title: "",
    description: "",
    hashtags: "",
  });
  const stateData = useLocation().state;
  const { id: paramsId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (String(stateData._id) !== String(paramsId)) {
      alert("영상 정보가 맞지 않습니다.\n홈으로 이동합니다.");
      navigate("/");
      return;
    }
    setEdit({
      _id: paramsId,
      title: stateData.title,
      description: stateData.description,
      hashtags: stateData.hashtags,
    });
  }, [stateData, paramsId, navigate]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/video/${paramsId}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(edit),
          credentials: "include",
        }
      );
      const json = await response.json();
      alert(json.message);
      if (!json.success) {
        if (response.status === 500) return;
        navigate("/");
        return;
      }
      navigate(`/video/${paramsId}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">수정 페이지</h1>
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="영상 제목"
          name="title"
          value={edit.title}
          onChange={handleChange}
          required
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <textarea
          placeholder="영상 설명"
          name="description"
          value={edit.description}
          onChange={handleChange}
          required
          className="block w-full h-32 border border-gray-300 rounded-lg p-3 resize-none"
        />
        <input
          type="text"
          placeholder="#해시태그 ,를 사용하여 구분"
          name="hashtags"
          value={edit.hashtags}
          onChange={handleChange}
          className="block w-full h-12 border border-gray-300 rounded-lg p-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
