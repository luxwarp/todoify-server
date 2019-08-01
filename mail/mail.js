const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  host: "world.luxwarp.info",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "luxwarp",
    pass: "Tjafsa90!"
  }
});

module.exports = smtpTransport;
