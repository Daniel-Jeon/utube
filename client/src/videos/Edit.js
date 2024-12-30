import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Edit = () => {
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
        `http://localhost:4000/api/video/${paramsId}/edit`,
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
    <>
      <h1>수정 페이지</h1>
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="영상 제목"
          name="title"
          value={edit.title}
          onChange={handleChange}
          required
        />
        <textarea
          placeholder="영상 설명"
          name="description"
          value={edit.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="#해시태그 ,를 사용하여 구분"
          name="hashtags"
          value={edit.hashtags}
          onChange={handleChange}
        />
        <button>업로드</button>
      </form>
    </>
  );
};

export default Edit;
