import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password, confirmPassword } = reqBody;

    // Validate input fields
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Email, password, or confirm password is missing" },
        { status: 400 }
      );
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Password and confirm password do not match" },
        { status: 400 }
      );
    }

    //  user by email
    const user = await User.findOne({ email }).select("+salt");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User with this email does not exist" },
        { status: 404 }
      );
    }


    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);


    user.password = hashedPassword;
    user.salt = salt;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating password:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update password" },
      { status: 500 }
    );
  }
}
