import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const VideoList = ({ videos }) => {
  const formateDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <>
      {videos.map((video) => (
        <div
          key={video._id}
          className="flex border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow mb-4"
        >
          {/* 썸네일 */}
          <div className="flex-shrink-0 w-80 h-40 bg-gray-200 rounded-md overflow-hidden mr-4">
            <Link to={`/video/${video._id}`} state={{ video }}>
              <img
                src={video.thumbnail || "/default-thumbnail.jpg"}
                alt={`${video.title} 썸네일`}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* 비디오 정보 */}
          <div className="flex-grow">
            <h1 className="text-xl font-bold mb-2">
              <Link to={`/video/${video._id}`} state={{ video }}>
                {video.title}
              </Link>
            </h1>
            <p className="text-gray-400 text-sm">
              조회수 {video.meta.views} • {formateDate(video.createdAt)}
            </p>
            <div className="flex items-center my-2">
              <Link
                to={`/user/${video.owner._id}`}
                className="flex items-center"
              >
                <img
                  src={video.owner.avatar || "/default-avatar.jpg"} // 기본 아바타 제공
                  alt={`${video.owner.nickname}의 아바타`}
                  className="w-10 h-10 rounded-full border border-gray-300 mr-2"
                />
                <p className="text-gray-700">{video.owner.nickname}</p>
              </Link>
            </div>
            <p className="text-gray-500 mb-2 line-clamp-2">
              {video.description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
const Search = () => {
  const [videos, setVideos] = useState([]);
  const params = new URLSearchParams(useLocation().search);
  const keyword = params.get("keyword");
  useEffect(() => {
    const fetchSearchVideos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/search?keyword=${keyword}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const json = await response.json();
        setVideos(json.videos);
      } catch (error) {
        console.error("Search Error :", error);
        alert("네트워크 에러가 발생하였습니다.\n잠시 후 다시 시도하세요.");
      }
    };
    fetchSearchVideos();
  }, [keyword]);
  return (
    <div className="p-8 flex flex-col align-middle w-11/12 mx-auto">
      <h1 className="text-3xl font-bold mb-6">검색 : {keyword}</h1>
      {videos.length === 0 ? (
        <span>검색 조건에 맞는 영상이 없습니다.</span>
      ) : (
        <VideoList videos={videos} />
      )}
    </div>
  );
};

export default Search;
