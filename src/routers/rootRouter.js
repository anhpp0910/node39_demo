const express = require("express");
const rootRouter = express.Router();
const videoRouter = require("./videoRouter");
const authRouter = require("./authRouter");

rootRouter.use("/video", videoRouter);
rootRouter.use("/auth", authRouter);

module.exports = rootRouter;
