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
          <li>영상</li>
          <li>
            <Link to={`/video/${video._id}`}>{video.title}</Link>
          </li>
          <li>{video.description}</li>
          <li>{video.hashtags}</li>
          <li>{formateDate(video.createdAt)}</li>
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
    <>
      <h1>HOME</h1>
      {videos.length > 0 ? (
        <VideoList videos={videos} />
      ) : (
        <span>영상이 없습니다.</span>
      )}
    </>
  );
};

export default Home;
