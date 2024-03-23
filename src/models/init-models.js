const DataTypes = require("sequelize").DataTypes;
const _code = require("./code");
const _users = require("./users");
const _video = require("./video");
const _video_comment = require("./video_comment");
const _video_like = require("./video_like");
const _video_type = require("./video_type");

function initModels(sequelize) {
  const code = _code(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);
  const video = _video(sequelize, DataTypes);
  const video_comment = _video_comment(sequelize, DataTypes);
  const video_like = _video_like(sequelize, DataTypes);
  const video_type = _video_type(sequelize, DataTypes);

  video.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video, { as: "videos", foreignKey: "user_id"});
  video_comment.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video_comment, { as: "video_comments", foreignKey: "user_id"});
  video_like.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(video_like, { as: "video_likes", foreignKey: "user_id"});
  video_comment.belongsTo(video, { as: "video", foreignKey: "video_id"});
  video.hasMany(video_comment, { as: "video_comments", foreignKey: "video_id"});
  video_like.belongsTo(video, { as: "video", foreignKey: "video_id"});
  video.hasMany(video_like, { as: "video_likes", foreignKey: "video_id"});
  video.belongsTo(video_type, { as: "type", foreignKey: "type_id"});
  video_type.hasMany(video, { as: "videos", foreignKey: "type_id"});

  return {
    code,
    users,
    video,
    video_comment,
    video_like,
    video_type,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
