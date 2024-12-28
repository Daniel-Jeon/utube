import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { UserContext } from "../contexts/User";

const Video = () => {
  const { user } = useContext(UserContext);
  const [owner, setOwner] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const videoData = location.state?.video;
  useEffect(() => {
    const fetchVerifyVideoOwnership = async () => {
      if (user === null) return;
      const response = await fetch(`http://localhost:4000/api/video/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (response.ok) setOwner(true);
    };
    fetchVerifyVideoOwnership();
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
