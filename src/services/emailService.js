import nodemailer from "nodemailer";
import config from "../config/config.js"

// Configuración del transportador
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.MAILING_EMAIL,
    pass: config.MAILING_PASSWORD,
  }
});

const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: config.MAILING_EMAIL,
    to: config.MAILING_EMAIL,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;