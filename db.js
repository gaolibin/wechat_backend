const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

console.log(MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS)
const sequelize = new Sequelize("wechat_app", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});


// 定义数据模型
const Counter = sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// 数据库初始化方法
async function init() {
  try{
    await Counter.sync({ alter: true });
  }catch(err){
    console.log(err)
  }
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
};
