import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Video = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [owner, setOwner] = useState(false);
  const [videoData, setVideoData] = useState(location.state?.video || null);
  useEffect(() => {
    const fetchVideoData = async () => {
      const response = await fetch(`http://localhost:4000/api/video/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!json.success) {
        setVideoData(null);
        alert(`${response.status} ${response.statusText}\n${json.message}`);
        navigate("/");
        return;
      }
      setVideoData(json.videoData);
    };
    fetchVideoData();
  }, [id, navigate]);
  useEffect(() => {
    if (!user || !videoData || !id) return;
    const fetchConfirmOwner = async () => {
      const response = await fetch(`http://localhost:4000/api/video/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      const json = await response.json();
      if (json.success) setOwner(true);
    };
    fetchConfirmOwner();
  }, [id, user, videoData]);
  const handleDeleteVideo = async (event) => {
    event.preventDefault();
    // 홈에서 가져온 영상 정보의 소유주와 전역 상태 관리중인 유저 정보를 비교
    if (String(videoData.owner._id) !== String(user.id)) {
      alert("권한없음");
      return;
    }
    const response = await fetch(
      `http://localhost:4000/api/video/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    alert(json.message);
    if (response.status === 500) return;
    navigate("/");
  };
  return (
    <>
      {videoData && (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <video
              className="rounded-md border border-gray-300"
              controls
              width="50%"
            >
              <source
                src={"http://localhost:4000/" + videoData.filepath}
              ></source>
            </video>
          </div>
          <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
          <p className="text-gray-700 mb-4">{videoData.description}</p>
          <p className="text-blue-500 text-sm mb-4">{videoData.hashtags}</p>
          <div className="flex">
            <img
              src={`../${videoData.owner.avatar}`}
              alt=""
              className="w-20 h-20 rounded-full border border-gray-300 mr-4"
            />
            <p className="text-gray-600 text-sm mb-4 self-end">
              {videoData.owner.nickname}
            </p>
          </div>
          {owner && (
            <div className="flex justify-between mt-4">
              <Link
                to={location.pathname + "/edit"}
                state={videoData}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
              >
                수정
              </Link>
              <button
                onClick={handleDeleteVideo}
                className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Video;
