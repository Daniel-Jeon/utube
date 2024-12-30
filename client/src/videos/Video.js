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
        <>
          <h1>{videoData.title}</h1>
          <video controls width="80%">
            <source
              src={"http://localhost:4000/" + videoData.filepath}
            ></source>
          </video>
          <h3>{videoData.description}</h3>
          <p>게시자 : {videoData.owner.nickname}</p>
          <p>{videoData.hashtags}</p>
          {owner && (
            <>
              <p>
                <Link to={location.pathname + "/edit"} state={videoData}>
                  수정
                </Link>
              </p>
              <p>
                <Link onClick={handleDeleteVideo}>삭제</Link>
              </p>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Video;
