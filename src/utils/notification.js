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
  try {
    transporter.sendMail({
      from: `"Real Chat Apk" <${process.env.EMAIL}>`,
      to,
      subject: "Login Detected 🔐",
      html: `
        <h2 style="color: blue;">Hello</h2>
        <p style="color: green;">You have successfully logged in.</p>
        <p style="color: red;">If this wasn’t you, please secure your account.</p>
      `
    }, (err, info) => {
      if (err) console.error("Email failed:", err.message);
      else console.log("Email sent:", info.response);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

