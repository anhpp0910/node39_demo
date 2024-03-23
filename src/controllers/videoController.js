const initModels = require("../models/init-models");
const sequelize = require("../models/connect");
const model = initModels(sequelize);
const { responseApi } = require("../config/response");
const { dataToken } = require("../config/jwt");

let getVideo = async (req, res) => {
  let data = await model.video.findAll({
    include: ["user", "type", "video_likes"],
  });

  responseApi(res, 200, data, "Thành công!");
};

let createVideo = (req, res) => {
  res.send("create video");
};

let getVideoType = async (req, res) => {
  let data = await model.video_type.findAll();
  responseApi(res, 200, data, "Thành công!");
};

let getVideoByType = async (req, res) => {
  let { typeId } = req.params;
  let data = await model.video.findAll({
    where: { type_id: typeId },
  });
  responseApi(res, 200, data, "Thành công!");
};

let getVideoByPage = async (req, res) => {
  let { page } = req.params;
  let pageSize = 3;
  let index = (page - 1) * pageSize;
  let countVideo = await model.video.count();
  let totalPage = Math.ceil(countVideo / 3);

  // SELECT * FROM video LIMIT page, pageSize
  let data = await model.video.findAll({
    offset: index,
    limit: pageSize,
  });
  responseApi(res, 200, { content: data, totalPage }, "Thành công!");
};

let getVideoDetail = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video.findOne({
    where: {
      video_id: videoId,
    },
    include: ["user"],
  });
  responseApi(res, 200, data, "Thành công!");
};

let getCommentVideo = async (req, res) => {
  let { videoId } = req.params;
  let data = await model.video_comment.findAll({
    where: {
      video_id: videoId,
    },
    order: [["date_create"]],
    include: ["user"],
  });
  responseApi(res, 200, data, "Thành công!");
};

let commentVideo = async (req, res) => {
  let { videoId, content } = req.body;
  let { token } = req.headers;

  let decode = dataToken(token);
  let { userId } = decode;

  let newComment = {
    video_id: videoId,
    user_id: userId,
    content,
    date_create: new Date(),
  };

  await model.video_comment.create(newComment);
  responseApi(res, 200, "", "Thành công!");
};

module.exports = {
  getVideo,
  createVideo,
  getVideoType,
  getVideoByType,
  getVideoByPage,
  getVideoDetail,
  getCommentVideo,
  commentVideo,
};
