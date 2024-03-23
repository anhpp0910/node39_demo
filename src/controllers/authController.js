const initModels = require("../models/init-models");
const sequelize = require("../models/connect");
const model = initModels(sequelize);
const { responseApi } = require("../config/response");
const bcrypt = require("bcrypt");
const {
  createToken,
  dataToken,
  createRefreshToken,
  checkRefreshTokenn,
} = require("../config/jwt");
const nodemailer = require("nodemailer");

const login = async (req, res) => {
  // find data
  let { email, password } = req.body;
  let checkEmail = await model.users.findOne({
    where: {
      email: email,
    },
  });

  if (checkEmail) {
    // check password
    if (bcrypt.compareSync(password, checkEmail.pass_word)) {
      let key = new Date().getTime();
      // Chuỗi mã hoá chứa thông tin user
      let token = createToken({ userId: checkEmail.dataValues.user_id, key });
      // Khởi tạo refresh token
      let refreshToken = createRefreshToken({
        userId: checkEmail.dataValues.user_id,
        key,
      });

      checkEmail.dataValues.refresh_token = refreshToken;

      await model.users.update(checkEmail.dataValues, {
        where: {
          user_id: checkEmail.dataValues.user_id,
        },
      });

      // let token = createToken({
      //   tenLop: "Bootcamp 58",
      //   HetHanString: "11/01/2024",
      //   HetHanTime: "1718064000000",
      // });

      responseApi(res, 200, token, "Đăng nhập thành công!");
    } else {
      responseApi(res, 400, "", "Mật khẩu không đúng!");
    }
  } else {
    responseApi(res, 400, "", "Email không đúng!");
  }
};

// yarn add bcrypt
const signup = async (req, res) => {
  try {
    // create data
    let { fullName, email, password } = req.body;
    let newUser = {
      full_name: fullName,
      email: email,
      pass_word: bcrypt.hashSync(password, 10),
      avatar: "",
      face_app_id: "",
      role: "USER",
    };

    let checkEmail = await model.users.findOne({
      where: {
        email: email,
      },
    });
    // email không trùng
    if (checkEmail) {
      responseApi(res, 400, "", "Email đã tồn tại!");
      return;
    }

    await model.users.create(newUser);
    responseApi(res, 200, "", "Đăng ký thành công!");
  } catch {
    responseApi(res, 500, "", "Đăng ký không thành công!");
  }
};

// login-facebook
const loginFacebook = async (req, res) => {
  try {
    let { faceAppId, name, email } = req.body;
    let checkUser = await model.users.findOne({
      where: {
        face_app_id: faceAppId,
      },
    });
    let token = "";
    // đã login facebook trước đó
    if (checkUser) {
      token = createToken({ userId: checkUser.dataValues.user_id });
    } else {
      let newUser = {
        full_name: name,
        email: email,
        pass_word: "",
        avatar: "",
        face_app_id: faceAppId,
        role: "USER",
      };
      let checkEmail = await model.users.findOne({
        where: {
          email: email,
        },
      });
      // email không trùng
      if (checkEmail) {
        responseApi(res, 400, "", "Email đã tồn tại!");
        return;
      }
      let data = await model.users.create(newUser);
      token = createToken({ userId: data.dataValues.user_id });
    }
    responseApi(res, 200, token, "Đăng nhập thành công!");
  } catch {
    responseApi(res, 500, "", "Lỗi!");
  }
};

// check email
const checkEmail = async (req, res) => {
  // find data
  let { email } = req.params;
  let checkEmail = await model.users.findOne({
    where: {
      email: email,
    },
  });

  if (checkEmail) {
    // tạo code
    let code = new Date().getTime(); // trả về milisecond từ 1/1/1970
    let newCode = {
      code,
      expired: new Date(),
    };
    await model.code.create(newCode);

    // gửi mail code
    // yarn add nodemailer
    let transport = nodemailer.createTransport({
      auth: {
        user: "phuonganhphanhhh@gmail.com",
        pass: "dvwanuiykafhqgyv",
      },
      service: "gmail",
    });

    let sendOptions = {
      from: "phuonganhphanhhh@gmail.com",
      to: email,
      subject: "Reset your password",
      text: `Code: ${code}`,
    };
    // gửi
    transport.sendMail(sendOptions, (error, info) => {});
    responseApi(res, 200, true, "Email tồn tại!");
  } else {
    responseApi(res, 200, false, "Email không tồn tại!");
  }
};

// check code
const checkCode = async (req, res) => {
  let { code } = req.params;
  let checkCode = await model.code.findOne({
    where: {
      code,
    },
  });
  if (checkCode) {
    // check expired
    responseApi(res, 200, true, "");
  } else {
    responseApi(res, 200, false, "Code không đúng");
  }
};

// refresh token
const refreshToken = async (req, res) => {
  let { token } = req.headers;

  let decode = dataToken(token);

  // check token hợp lệ
  // check user => lấy refresh token
  let checkUser = await model.users.findOne({
    where: {
      user_id: decode.userId,
    },
  });

  if (checkUser) {
    // check refresh token hợp lệ
    let checkRefreshToken = checkRefreshTokenn(
      checkUser.dataValues.refresh_token
    );
    // check key
    let decodeRefreshToken = dataToken(checkUser.dataValues.refresh_token);
    if (checkRefreshToken == null && decode.key == decodeRefreshToken.key) {
      // tạo token
      let token = createToken({
        userId: checkUser.dataValues.user_id,
        key: decodeRefreshToken.key,
      });
      responseApi(res, 200, token, "Thành công!");
      return;
    }
  }
  responseApi(res, 401, "", "Unauthorized!");
};

module.exports = {
  login,
  signup,
  loginFacebook,
  checkEmail,
  checkCode,
  refreshToken,
};
