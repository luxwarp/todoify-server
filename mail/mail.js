const nodemailer = require("nodemailer");
const config = require("../config/config");

const smtpTransport = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD
  }
});

module.exports = smtpTransport;
