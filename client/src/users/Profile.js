import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../contexts/User";

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
            <p className="text-gray-600">{video.description}</p>
            <li>{video.hashtags + ""}</li>
            <li>{formateDate(video.createdAt)}</li>
            <div className="flex">
              <img
                src={video.owner.avatar ? video.owner.avatar : "/default.webp"}
                alt=""
                className="w-16 h-16 rounded-full border border-gray-300 mr-4"
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

const Profile = () => {
  const { user } = useContext(UserContext);
  const params = useParams().id;
  const [profileData, setProfileData] = useState([]);
  const [videos, setVideos] = useState({});
  useEffect(() => {
    const fetchUserVideos = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/${params}/videos`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const json = await response.json();
      setProfileData(json.user);
      setVideos(json.videos);
    };
    fetchUserVideos();
  }, [params]);
  console.log(profileData);
  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">
          <img
            src={profileData.avatar ? profileData.avatar : "/default.webp"}
            alt=""
            className="w-20 h-20 rounded-full border border-gray-300 mr-4"
          />
          {profileData.nickname} 프로필
        </h1>
        {user && user.id === profileData._id && (
          <h1>
            <Link to={`/user/${params}/edit`}>프로필 수정</Link>
          </h1>
        )}
      </div>
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

export default Profile;
