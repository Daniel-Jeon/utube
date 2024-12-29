import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Video = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  console.log(navigate);
  const { id } = useParams();
  const [owner, setOwner] = useState(false);
  const [videoData, setVideoData] = useState(
    useLocation().state?.video || null
  );
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
    if (!user) return;
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
  }, [id, user]);
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
                <Link to="#">수정</Link>
              </p>
              <p>
                <Link to="#">삭제</Link>
              </p>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Video;
