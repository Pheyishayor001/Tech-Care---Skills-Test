// reading the .env file FROM THIS MODULE
// const dotenv = require("dotenv");
// dotenv.config();

// module.exports = {
//   userName: process.env.USERNAME,
//   passWord: process.env.PASSWORD,
// };

import dotenv from "./dotenv";
dotenv.config();

export const userName = process.env.USERNAME;
export const passWord = process.env.PASSWORD;
// console.log(
//   `Your port is ${process.env.PORT} and your name is ${process.env.PASSWORD}`
// ); // 8626
