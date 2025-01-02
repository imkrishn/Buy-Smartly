import nodemailer from 'nodemailer'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'


export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    //create a hash token

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "Verify") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 600000
      })
    } else if (emailType === "Reset") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      //host: "sandbox.smtp.mailtrap.io",
      //port: 2525, 
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
      }
    });

    const mailOptions = {
      from: "teamkk369@gmail.com",
      to: email,
      subject: emailType === "Verify" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <p>Click <a href="${process.env.NEXT_PUBLIC_API_URL}/${emailType === "Verify" ? "verifyemail" : "resetpassword"
        }?token=${hashedToken}">here</a> to ${emailType === "Verify" ? "verify your email" : "reset your password"
        }.</p>
        <p>This link will expire in ${emailType === "Verify" ? "15 minutes" : "1 hour"
        }.</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;

  } catch (Err) {
    console.log(Err);

  }
}