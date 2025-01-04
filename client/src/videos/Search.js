import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const VideoList = ({ videos }) => {
  const formateDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <>
      {videos.map((video) => (
        <ul key={video._id}>
          <div className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <h1 className="text-2xl font-semibold">
              <Link to={`/video/${video._id}`} state={{ video }}>
                {video.title}
              </Link>
            </h1>
            <p className="text-gray-500">{video.description}</p>
            <li className="text-gray-500">{video.hashtags + ""}</li>
            <li className="text-gray-500">{formateDate(video.createdAt)}</li>
            <div className="flex">
              <img
                src={video.owner.avatar ? video.owner.avatar : "/default.webp"} // 기본 이미지 제공
                alt={`${video.nickname}의 아바타`}
                className="w-12 h-12 rounded-full border border-gray-300 mr-4"
              />
              <p className="self-end">{video.owner.nickname}</p>
            </div>
          </div>
          <br />
        </ul>
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
          `http://localhost:4000/api/search?keyword=${keyword}`,
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
    <div className="p-8 flex flex-col align-middle w-3/4 mx-auto">
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
