import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        <div key={video._id} className="p-2">
          {/* 썸네일 */}
          <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center mb-2 overflow-hidden">
            <Link to={`/video/${video._id}`} state={{ video }}>
              {video.thumbnail ? (
                <img
                  src={video.thumbnail} // 썸네일 이미지 URL
                  alt={`${video.title} 썸네일`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>썸네일 없음</span>
              )}
            </Link>
          </div>
          {/* 텍스트 정보 */}
          <div className="flex">
            {/* 작성자 정보 */}
            <div className="mr-2 mt-2 w-10 h-10">
              <Link to={`/user/${video.owner._id}`}>
                <img
                  src={
                    video.owner.avatar ? video.owner.avatar : "/default.webp"
                  }
                  alt="Avatar"
                  className="rounded-full"
                />
              </Link>
            </div>
            {/* 영상 정보 */}
            <div className="w-10/12">
              <h3 className="text-lg font-bold line-clamp-2">
                <Link to={`/video/${video._id}`} state={{ video }}>
                  {video.title}
                </Link>
              </h3>
              <p className="text-sm">
                <Link to={`/user/${video.owner._id}`}>
                  {video.owner.nickname}
                </Link>
              </p>
              <p className="text-sm">
                조회수 {video.meta.views} / {formateDate(video.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + "/api/videos",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await response.json();
        if (!json.success) return;
        setVideos(json.videos);
      } catch (error) {
        console.error("fetchVideo:", error);
        setVideos([]);
      }
    };
    fetchVideos();
  }, []);
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          <VideoList videos={videos} />
        ) : (
          <span>영상이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default Home;
