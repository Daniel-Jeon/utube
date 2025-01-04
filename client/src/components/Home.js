import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
            <h3 className="text-xl font-semibold">
              <Link to={`/video/${video._id}`} state={{ video }}>
                {video.title}
              </Link>
            </h3>
            <p className="text-gray-500">{video.description}</p>
            <li className="text-gray-500">{video.hashtags + ""}</li>
            <li className="text-gray-500">{formateDate(video.createdAt)}</li>
            <div className="flex">
              <img
                src={video.owner.avatar ? video.owner.avatar : "/default.webp"} // 기본 이미지 제공
                alt=""
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

const Home = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/videos", {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
      <h1 className="text-3xl font-bold mb-6">HOME</h1>
      <div className="grid grid-cols-4 gap-4">
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
