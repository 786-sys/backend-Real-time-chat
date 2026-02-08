import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ===============================
// 3️⃣ Login Notification Email
// ===============================
export const sendLoginEmail = async (to) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.EMAIL_FROM, // MUST be verified
        name: "Real Chat App 🔐",
      },
      subject: "New Login Detected",
      html: `
        <h2>🔐 Login Alert</h2>
        <p>A new login was detected on your account.</p>
        <p>If this wasn’t you, reset your password immediately.</p>
      `,
    };

    await sgMail.send(msg);
    console.log("📧 Login email sent successfully");
  } catch (error) {
    console.error("❌ SendGrid API error:", error.response?.body || error.message);
  }
};
