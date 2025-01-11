import { useContext, useEffect, useRef, useState } from "react";
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
        ...(meta === "likes" ? { credentials: "include" } : {}),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      alert(json.message);
      return;
    }
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

  const videoRef = useRef(0);
  const prevRef = useRef(0);
  const commentRef = useRef();

  const [owner, setOwner] = useState(false);
  const [videoData, setVideoData] = useState(location.state?.video || null);
  const [metaLikes, setMetaLikes] = useState(0);
  const [metaViews, setMetaViews] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState("");
  const [videoComments, setVideoComments] = useState([]);
  // 서버에서 비디오 정보 가져오기
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
  // 서버에서 댓글 정보 가져오기
  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/video/${paramId}/comments`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await response.json();
        setVideoComments(json.commentsData);
      } catch (error) {
        console.error(error);
        alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
      }
    };
    fetchCommentData();
  }, [paramId]);
  // 로그인한 유저가 비디오의 오너가 맞는지 확인
  useEffect(() => {
    //if (!user || !videoData || !paramId) return;
    if (!user || !paramId) return;
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
  }, [paramId, user]);
  // 좋아요 타이머
  useEffect(() => {
    if (!cooldown) return;
    const timeout = setTimeout(() => setCooldown(false), 60 * 60 * 24 * 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);
  const handleDeleteVideo = async (event) => {
    event.preventDefault();
    // 홈에서 가져온 영상 정보의 소유주와 전역 상태 관리중인 유저 정보를 비교
    if (String(videoData.owner._id) !== String(user?.id)) {
      alert("권한이 없습니다.");
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
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("로그인한 유저가 아닙니다.");
      navigate("/login");
      return;
    }
    if (!comment) {
      alert("댓글을 입력하세요.");
      commentRef.current.focus();
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/video/${paramId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
          credentials: "include",
        }
      );
      const json = await response.json();
      setComment("");
      setVideoComments((prevState) => [json.commentData, ...prevState]);
    } catch (error) {
      console.error(error);
      alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/video/${paramId}/comment/${commentId}`,
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
      if (json.success)
        setVideoComments((prevState) =>
          prevState.filter((comment) => comment._id !== json.deleteId)
        );
    } catch (error) {
      console.error(error);
      alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
    }
  };
  const handleTimeUpdate = () => {
    if (!isPlaying) return;
    const currentTime = videoRef.current.currentTime;
    if (currentTime > prevRef.current)
      setTotalTime((prevState) => prevState + (currentTime - prevRef.current));
    prevRef.current = currentTime;
  };
  const handleOnPlay = () => {
    setIsPlaying(true);
  };
  const handleOnPause = () => {
    setIsPlaying(false);
  };
  const handleMetaViews = () => {
    // 시청시간 90%를 기준을 생각했으나 timeupdate 이벤트 딜레이로 인해 완화
    if (!(totalTime >= videoRef.current.duration * 0.1)) return;
    fetchMetaData(videoData._id, paramId, "views", setMetaViews);
  };
  const handleMetaLikes = () => {
    if (cooldown) {
      alert("좋아요를 반복해서 누를 수 없습니다.");
      return;
    }
    setCooldown(true);
    fetchMetaData(videoData._id, paramId, "likes", setMetaLikes);
  };
  function handleComment(event) {
    setComment(event.target.value);
  }
  return (
    <>
      {videoData && (
        <div className="w-full bg-white shadow-md rounded-lg py-4">
          <div className="flex justify-center mb-4">
            <video
              className="rounded-md border border-gray-300"
              controls
              width="50%"
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handleOnPlay}
              onPause={handleOnPause}
              onEnded={handleMetaViews}
              autoPlay
              muted
            >
              <source
                src={"http://localhost:4000/" + videoData.filepath}
              ></source>
            </video>
          </div>
          {/*여기서 2분할*/}
          <div className="flex">
            {/*좌측에 영상 정보를 출력*/}
            <div className="flex-1 pl-16">
              <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
              <p className="text-gray-700 mb-4">{videoData.description}</p>
              <p className="text-blue-500 text-sm mb-4">{videoData.hashtags}</p>
              <div className="flex">
                <img
                  src={
                    videoData.owner.avatar
                      ? `http://localhost:4000/${videoData.owner.avatar}`
                      : "/default.webp"
                  }
                  alt=""
                  className="w-20 h-20 rounded-full border border-gray-300 mr-4"
                />
                <p className="text-gray-600 text-sm mb-4 self-end">
                  {videoData.owner.nickname}
                </p>
              </div>
            </div>
            {/*우측에 메타테이터 및 버튼*/}
            <div className="flex flex-1 flex-col items-end justify-center pr-16">
              {/*메타데이터*/}
              <div className="flex-1 flex flex-col items-center justify-center pr-8">
                <p className="text-2xl" onClick={handleMetaLikes}>
                  <Link>👍 : {metaLikes}</Link>
                </p>
                <br />
                <p className="text-2xl">시청수 : {metaViews}</p>
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
                    className="bg-red-500 text-white mx-5 px-4 py-2 rounded shadow-md hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          {user && (
            <form method="POST" onSubmit={handleSubmitComment}>
              <div className="my-12 px-20 flex items-center justify-center">
                <img
                  src={
                    user.avatar
                      ? `http://localhost:4000/${user.avatar}`
                      : "/default.webp"
                  }
                  alt=""
                  className="w-12 h-12 rounded-full border border-gray-300 mr-4"
                />
                <input
                  className="border border-gray-400 rounded-3xl w-10/12 mr-4 p-2"
                  placeholder="악플은 범죄입니다."
                  maxLength={300}
                  name="text"
                  onChange={handleComment}
                  value={comment}
                  ref={commentRef}
                />
                <button className="w-12 h-12 bg-blue-500 text-white rounded-3xl ">
                  입력
                </button>
              </div>
            </form>
          )}
          <div className="px-20">
            총 댓글({videoComments.length})
            {videoComments.map((comment) => (
              <div className="mt-4 flex" key={comment._id}>
                <img
                  className="mr-2 w-12 h-12"
                  src={
                    comment.owner.avatar
                      ? `http://localhost:4000/${comment.owner.avatar}`
                      : "/default.webp"
                  }
                  alt=""
                />
                <div className="w-11/12 mr-5">
                  <p className="text-gray-400">@{comment.owner.nickname}</p>
                  <p>{comment.text}</p>
                </div>
                {(String(user?.id) === String(comment.owner._id) || owner) && (
                  <div className="flex items-center">
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      ❌
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Video;
