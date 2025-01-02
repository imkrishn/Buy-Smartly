import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function POST(req: NextRequest) {
  try {

    const reqBody = await req.json();
    const { token, emailType } = reqBody;

    const isToken = token.split(" ")
    const validToken = isToken[0]

    if (!validToken) {
      return NextResponse.json(
        { success: false, message: "Token is not present" },
        { status: 400 }
      );
    }

    if (emailType === "Verify") {
      const user = await User.findOne({
        verifyToken: validToken,
        verifyTokenExpiry: { $gt: Date.now() }
      }).select('+verifyTokenExpiry');


      if (!user) {
        return NextResponse.json(
          { success: false, message: "Token is Invalid or Expired" },
          { status: 400 }
        );
      }

      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();

    } else if (emailType === "Reset") {

      const user = await User.findOne({
        forgotPasswordToken: validToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() }
      }).select('+forgotPasswordTokenExpiry');


      if (!user) {
        return NextResponse.json(
          { success: false, message: "Token is Invalid or Expired" },
          { status: 400 }
        );
      }

      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "User email successfully verified",
    });
  } catch (err) {
    console.error("Error during verification:", err);

    return NextResponse.json(
      { success: false, message: "Failed to verify the email" },
      { status: 500 }
    );
  }
}
