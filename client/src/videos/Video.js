import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/User";

const fetchMetaData = async (videoId, paramId, meta, cbUpdateMeta) => {
  if (String(videoId) !== String(paramId)) {
    alert("영상 정보가 맞지 않습니다.");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:4000/api/video/${videoId}/meta?meta=${meta}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
        credentials: "include",
      }
    );
    const json = await response.json();
    alert(json.message);
    if (!response.ok) return;
    cbUpdateMeta((prevState) => prevState + 1);
  } catch (error) {
    console.error(error);
    alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
  }
};

const Video = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const location = useLocation();
  const [owner, setOwner] = useState(false);
  const [videoData, setVideoData] = useState(location.state?.video || null);
  const [metaLikes, setMetaLikes] = useState(0);
  const [metaViews, setMetaViews] = useState(0);
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/video/${paramId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await response.json();
        if (!json.success) {
          setVideoData(null);
          alert(`${response.status} ${response.statusText}\n${json.message}`);
          navigate("/");
          return;
        }
        setVideoData(json.videoData);
        setMetaLikes(json.videoData.meta.likes);
        setMetaViews(json.videoData.meta.views);
      } catch (error) {
        console.error(error);
        alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
      }
    };
    fetchVideoData();
  }, [paramId, navigate]);
  useEffect(() => {
    if (!user || !videoData || !paramId) return;
    const fetchConfirmOwner = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/video/${paramId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            credentials: "include",
          }
        );
        if (response.ok) setOwner(true);
      } catch (error) {
        console.error(error);
        alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
      }
    };
    fetchConfirmOwner();
  }, [paramId, user, videoData]);
  const handleDeleteVideo = async (event) => {
    event.preventDefault();
    // 홈에서 가져온 영상 정보의 소유주와 전역 상태 관리중인 유저 정보를 비교
    if (String(videoData.owner._id) !== String(user.id)) {
      alert("권한없음");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/video/${paramId}/delete`,
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
    } catch (error) {
      console.error(error);
      alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
    }
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
          {/*여기서 2분할*/}
          <div className="flex">
            {/*좌측에 영상 정보를 출력*/}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
              <p className="text-gray-700 mb-4">{videoData.description}</p>
              <p className="text-blue-500 text-sm mb-4">{videoData.hashtags}</p>
              <div className="flex">
                <img
                  src={
                    videoData.owner.avatar
                      ? `../${videoData.owner.avatar}`
                      : "/default.webp"
                  }
                  alt="."
                  className="w-20 h-20 rounded-full border border-gray-300 mr-4"
                />
                <p className="text-gray-600 text-sm mb-4 self-end">
                  {videoData.owner.nickname}
                </p>
              </div>
            </div>
            {/*우측에 메타테이터 및 버튼*/}
            <div className="flex flex-1 flex-col items-center justify-center">
              {/*메타데이터*/}
              <div className="flex-1 flex flex-col items-center justify-center">
                <p
                  className="text-2xl"
                  onClick={() =>
                    fetchMetaData(videoData._id, paramId, "likes", setMetaLikes)
                  }
                >
                  <Link>👍 : {metaLikes}</Link>
                </p>
                <br />
                <p className="text-2xl">
                  <Link onClick="">시청수 : {metaViews}</Link>
                </p>
              </div>
              {owner && (
                <div className="flex-1 flex items-center">
                  <button
                    onClick={() =>
                      navigate(`${location.pathname}/edit`, {
                        state: videoData,
                      })
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteVideo}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Video;
