import nodemailer from "nodemailer";
console.log("SMTP USER:", process.env.BREVO_SMTP_USER);
console.log("SMTP PASS:", process.env.BREVO_SMTP_PASS);
const transporter = nodemailer.createTransport({
  
  host: process.env.BREVO_SMTP_HOST,
  port: parseInt(process.env.BREVO_SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export default transporter;