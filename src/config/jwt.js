// yarn add jsonwebtoken
const jwt = require("jsonwebtoken");
const { responseApi } = require("./response");

// tạo token
// data => object
const createToken = (data) =>
  jwt.sign(data, "BI_MAT", { algorithm: "HS256", expiresIn: "10m" });
// HS256, thời hạn sử dụng expiresIn

// check token
// 1: sai khoá bảo mật
// 2: hết hạn sử dụng
// 3: token sai định dạng, token thiếu dữ liệu
// err = null => token hợp lệ
// err != null => token không hợp lệ
const checkToken = (token) => jwt.verify(token, "BI_MAT", (err, decode) => err);

const createRefreshToken = (data) =>
  jwt.sign(data, "BI_MAT_2", { algorithm: "HS256", expiresIn: "7d" });

const checkRefreshTokenn = (token) =>
  jwt.verify(token, "BI_MAT_2", (err, decode) => err);

// giải mã token
const dataToken = (token) => jwt.decode(token);

const midVerifyToken = (req, res, next) => {
  let { token } = req.headers;
  let check = checkToken(token);
  console.log(check);
  if (check == null) next();
  else responseApi(res, 401, "", check);
};

module.exports = {
  createToken,
  checkToken,
  dataToken,
  midVerifyToken,
  createRefreshToken,
  checkRefreshTokenn,
};
