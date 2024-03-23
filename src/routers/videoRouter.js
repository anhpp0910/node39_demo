const express = require("express");
const videoRouter = express.Router();
const {
  getVideo,
  getVideoType,
  getVideoByType,
  getVideoByPage,
  getVideoDetail,
  getCommentVideo,
  commentVideo,
} = require("../controllers/videoController");
const { midVerifyToken } = require("../config/jwt");

// middleware

// quản lý API
videoRouter.get("/get-video", midVerifyToken, getVideo);

// API get video type
videoRouter.get("/get-video-type", getVideoType);

// API get video type
videoRouter.get("/get-video-by-type/:typeId", getVideoByType);

// API get video type
videoRouter.get("/get-video-by-page/:page", midVerifyToken, getVideoByPage);

// API get video detail
videoRouter.get("/get-video-detail/:videoId", getVideoDetail);

// API get ds comment theo videoId
videoRouter.get("/get-comment-video/:videoId", getCommentVideo);

// API post comment theo videoId và userId
videoRouter.post("/comment-video", commentVideo);

module.exports = videoRouter;
