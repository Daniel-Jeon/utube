import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

export const postUpload = async (req, res) => {
  const {
    file: { path: filepath },
    body: { title, description, hashtags },
    session,
  } = req;
  if (!session || !session.user)
    return res
      .status(401)
      .json({ message: "로그인이 필요합니다.", success: false });
  if (!req.file)
    return res
      .status(400)
      .json({ message: "업로드한 파일이 없습니다.", success: false });
  try {
    const videoData = await Video.create({
      filepath,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: session.user.id,
    });
    //console.log(typeof videoData._id);
    const userData = await User.findById(session.user.id);
    userData.videos.push(videoData._id);
    userData.save();
    return res
      .status(201)
      .json({ message: "성공", success: true, video: videoData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "업로드에 실패했습니다.", success: false });
  }
};

export const getVideoData = async (req, res) => {
  const { id } = req.params;
  const videoData = await Video.findById(id)
    .populate({
      path: "owner",
      select: "_id email nickname avatar",
    })
    .select("-__v -comments");
  if (!videoData)
    return res
      .status(404)
      .json({ message: "영상이 존재하지 않습니다.", success: false });
  return res.status(200).json({ success: true, videoData });
};

export const getComments = async (req, res) => {
  const { id } = req.params;
  const commentsData = await Comment.find({
    video: id,
  })
    .populate({
      path: "owner",
      select: "_id email nickname avatar",
    })
    .sort({ createdAt: -1 });
  //console.log("댓글", commentsData);
  return res.status(200).json({ commentsData });
};

export const postConfirmOwner = async (req, res) => {
  const {
    body: userData,
    params: { id: videoId },
  } = req;
  try {
    const videoData = await Video.findById(videoId);
    if (String(videoData.owner) !== String(userData.id))
      return res.status(403).end();
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export const deleteVideo = async (req, res) => {
  const { id: userId } = req.session.user;
  const { id: videoId } = req.params;
  try {
    const confirmOwner = await Video.findById(videoId);
    if (!confirmOwner)
      return res
        .status(404)
        .json({ message: "영상이 존재하지 않습니다.", success: false });
    if (String(confirmOwner.owner) !== String(userId))
      return res
        .status(403)
        .json({ message: "권한이 없습니다.", success: false });
    await Video.deleteOne({ _id: videoId });
    return res
      .status(200)
      .json({ message: "영상이 삭제되었습니다.", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "삭제 중 에러 발생\n잠시후 다시 시도하세요.",
      success: false,
    });
  }
};

export const postEditVideo = async (req, res) => {
  const { _id: videoId, title, description, hashtags } = req.body;
  const { id: userId } = req.session.user;
  if (String(videoId) !== String(req.params.id))
    return res.status(403).json({
      message: "영상 정보가 맞지 않습니다.\n홈으로 이동합니다.",
      success: false,
    });
  try {
    const videoData = await Video.findById(videoId);
    if (!videoData)
      return res
        .status(404)
        .json({ message: "영상이 존재하지 않습니다.", success: false });
    if (String(userId) !== String(videoData.owner))
      return res.status(403).json({
        message: "영상 정보가 맞지 않습니다.\n홈으로 이동합니다.",
        success: false,
      });
    await Video.updateOne(
      { _id: videoId },
      {
        $set: {
          title,
          description,
          hashtags: Video.formatHashtags(hashtags),
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "영상정보가 수정되었습니다.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "업데이트 도중 오류가 발생하였습니다.\n잠시 후 다시 시도하세요.",
      success: false,
    });
  }
};

export const postEditVideoMeta = async (req, res) => {
  const { id: paramsId } = req.params;
  const { videoId } = req.body;
  const { meta } = req.query;
  if (!paramsId || !videoId || !meta)
    return res.status(400).json({ message: "잘못된 접근입니다. " });
  if (String(paramsId) !== String(videoId))
    return res.status(401).json({ message: "영상 정보가 맞지 않습니다." });
  try {
    let updateObj = {};
    switch (meta) {
      case "likes":
        updateObj["meta.likes"] = 1;
        break;
      case "views":
        updateObj["meta.views"] = 1;
        break;
    }
    await Video.findByIdAndUpdate(videoId, { $inc: updateObj }, { new: true });
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "서버 오류 발생\n잠시후 다시 시도하세요." });
  }
};

export const postVideoComment = async (req, res) => {
  const { user } = req.session;
  const { text } = req.body;
  const { id } = req.params;
  if (!user || !text || !id)
    return res.status(400).json({ message: "잘못된 접근입니다. " });
  try {
    const userData = await User.findById(user.id);
    const videoData = await Video.findById(id);
    const createComment = await Comment.create({
      text,
      owner: userData._id,
      video: videoData._id,
    });
    videoData.comments.push(createComment._id);
    videoData.save();
    userData.comments.push(createComment._id);
    userData.save();
    const commentData = await Comment.findById(createComment._id).populate({
      path: "owner",
      select: "nickname avatar",
    });
    return res.status(201).json({ commentData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "서버 오류 발생\n잠시후 다시 시도하세요." });
  }
};

export const deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params;
  const { user } = req.session;
  try {
    const commentData = await Comment.findById(commentId).populate("video");
    if (!commentData)
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (String(commentData.video._id) !== String(videoId))
      return res.status(403).json({
        success: false,
        message: "영상과 댓글 정보가 일치하지 않습니다.",
      });
    // 영상 소유자이거나, 댓글 소유자일 경우 삭제할 권한이 있음
    const commentOwner = commentData.owner.toString() === String(user.id);
    const videoOwner = commentData.video.owner.toString() === String(user.id);
    if (!commentOwner && !videoOwner)
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    await Video.findByIdAndUpdate(videoId, { $pull: { comments: commentId } });
    await User.findByIdAndUpdate(commentData.owner.toString(), {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      success: true,
      message: "댓글이 삭제되었습니다.",
      deleteId: commentId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버 오류 발생\n잠시후 다시 시도하세요.",
    });
  }
};
