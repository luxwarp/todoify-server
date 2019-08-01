const envFile = require("dotenv").config();

if (envFile.error) {
  throw new Error("Problem reading .env file.");
} else {
  const config = {
    APP_NAME: process.env.APP_TITLE || "Todoify Server",
    PROCESS_NAME: process.env.PROCESS_NAME || "todoify-server",
    STARTUP_MESSAGE:
      process.env.STARTUP_MESSAGE || "Starting Todoify Server...",
    API_DOCUMENTATION_LINK:
      process.env.API_DOCUMENTATION_LINK ||
      "https://documenter.getpostman.com/view/1602420/S1Zz6UxQ?version=latest",
    PORT: process.env.HOST_PORT || "5050",
    SECRET_KEY: process.env.SECRET_KEY || "Iam-Super_secret-dont-!hack-Me",
    TOKEN_EXPIRESIN: process.env.TOKEN_EXPIRESIN || "1h",
    MORGAN_LEVEL: process.env.MORGAN_LEVEL || "dev",
    MONGODB_URI:
      process.env.MONGODB_URI ||
      "mongodb://username:password@localhost:27017/todoify",
    DB_RECONNECT_SECONDS: process.env.DB_RECONNECT_SECONDS || 5,
    SMTP_HOST: process.env.SMTP_HOST || "localhost",
    SMTP_PORT: process.env.SMTP_PORT || 587,
    SMTP_USERNAME: process.env.SMTP_USERNAME || "username",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "password",
    SMTP_DEFAULT_FROM: process.env.SMTP_DEFAULT_FROM || "no-reply@localhost"
  };

  module.exports = config;
}
