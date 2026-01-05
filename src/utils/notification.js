import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendLoginEmail = async (to) => {
    console.log("Sending login email to " + to);
    console.log(process.env.EMAIL);
    console.log(process.env.EMAIL_PASSWORD);
  await transporter.sendMail({
    from: `"Real Chat Apk " <${process.env.EMAIL}>`,
    to,
    subject: "Login Detected 🔐",
    html: `
      <h2>Hello</h2>
      <p>You have successfully logged in.</p>
      <p>If this wasn’t you, please secure your account.</p>
    `
  });
};
