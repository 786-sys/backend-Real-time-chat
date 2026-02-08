import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables

// ===============================
// 1️⃣ Create SendGrid Transporter
// ===============================
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey", // REQUIRED by SendGrid
    pass: process.env.SENDGRID_API_KEY,
  },
});

// ===============================
// 2️⃣ Verify Transporter (Optional but Recommended)
// ===============================
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SendGrid connection failed:", error);
  } else {
    console.log("✅ SendGrid email server ready");
  }
});

// ===============================
// 3️⃣ Login Notification Email
// ===============================
export const sendLoginEmail = async (to) => {
  try {
    const mailOptions = {
      from: `"Real Chat App 🔐" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "New Login Detected",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color:#2563eb;">🔐 Login Alert</h2>

          <p>Hello,</p>

          <p>
            A new login was detected on your <strong>Real Chat App</strong> account.
          </p>

          <p style="color:#16a34a;">
            ✅ If this was you, no action is required.
          </p>

          <p style="color:#dc2626;">
            ❌ If this wasn’t you, please reset your password immediately.
          </p>

          <hr />

          <small style="color:#6b7280;">
            This is an automated security email. Please do not reply.
          </small>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Login email sent:", info.messageId);
      if(info.rejected.length > 0) {
        console.log("not send ");
      }else{
       console.log("send successfully ");
      }
  } catch (error) {
    console.error("❌ Failed to send login email:", error.message);
  }
};
