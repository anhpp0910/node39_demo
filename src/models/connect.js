const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

const checkConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection OK");
  } catch (error) {
    console.log("Conection NG");
    console.log(error);
  }
};
checkConnect();

module.exports = sequelize;
