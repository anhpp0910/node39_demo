const express = require("express");
const authRouter = express.Router();
const {
  login,
  signup,
  loginFacebook,
  checkEmail,
  checkCode,
  refreshToken,
} = require("../controllers/authController");

// login
authRouter.post("/login", login);

// signup
authRouter.post("/signup", signup);

// login-facebook
authRouter.post("/login-facebook", loginFacebook);

// check email
authRouter.post("/check-email/:email", checkEmail);

// check email
authRouter.post("/check-code/:code", checkCode);

// change password
// email, mật khẩu mới từ client

// refresh token
authRouter.post("/refresh-token", refreshToken);

// __dirname // trả đường dẫn file đang đứng
// process.cwd() // trả đường dẫn gốc

// yarn add multer
const multer = require("multer");

// đường dẫn lưu và tên file (không trùng)
let storage = multer.diskStorage({
  destination: process.cwd() + "/public/img",
  filename: (req, file, callback) => {
    let newName = new Date().getTime() + "_" + file.originalname;
    callback(null, newName);
  },
});
let upload = multer({ storage });

const fs = require("fs");

const compress_images = require("compress-images");

authRouter.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  let { file } = req;

  await compress_images(
    process.cwd() + "/public/img/" + file.filename,
    process.cwd() + "/public/file/",

    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      console.log("-------");
      console.log(error);
      console.log(completed);
      console.log(statistic);
      console.log("-------");
    }
  );

  // lưu vào table

  // tạo file, tham số 1: destination (gồm tên file),
  // tham số 2: nội dung file
  // tham số 3: cb
  // fs.writeFile(process.cwd() + "/test.txt", "hellp world", (error) => {});
  fs.readFile(process.cwd() + "/public/img/" + file.filename, (err, data) => {
    let nameImg =
      `data:${file.mimetype};base64,` + Buffer.from(data).toString("base64");
    res.send(nameImg);
  });
});

module.exports = authRouter;
