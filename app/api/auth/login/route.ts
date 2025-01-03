import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "@/utils/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;


    //user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist with this email" },
        { status: 404 }
      );
    }

    const isVerified = user?.isVerified;

    if (!isVerified) {
      sendMail({ email, emailType: "Verify", userId: user._id })
      return NextResponse.json(
        { success: false, message: "Email Verification link sent to you Mail." },
      );
    }

    // Compare password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    // Validate TOKEN_SECRET
    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET is not defined in the environment variables.");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create token data
    const tokenData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };

    // Create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    // Send response with cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 1 day 
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Error in login:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
