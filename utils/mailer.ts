import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

// Pre-configure the transporter for better performance (connection pooling enabled)
const transport = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  pool: true,
  maxConnections: 10,
  maxMessages: 100,
});

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update the user data in parallel with sending the email
    const userUpdatePromise =
      emailType === "Verify"
        ? User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 600000, // 10 minutes
        })
        : User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
        });

    const mailOptions = {
      from: "teamkk369@gmail.com",
      to: email,
      subject: emailType === "Verify" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <p>Click <a href="${process.env.NEXT_PUBLIC_API_URL}/${emailType === "Verify" ? "verifyemail" : "resetpassword"}?token=${hashedToken}">
        here</a> to ${emailType === "Verify" ? "verify your email" : "reset your password"}.</p>
        <p>This link will expire in ${emailType === "Verify" ? "15 minutes" : "1 hour"}.</p>
      `,
    };

    const mailResponsePromise = transport.sendMail(mailOptions);

    // Wait for both database update and email sending to complete
    const [userUpdate, mailResponse] = await Promise.all([
      userUpdatePromise,
      mailResponsePromise,
    ]);

    return mailResponse;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to send email.");
  }
};
