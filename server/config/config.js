const dotnev=require("dotenv");

require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

module.exports = config;