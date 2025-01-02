import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendMail } from "@/utils/mailer";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is missing" }, { status: 400 })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User with this email not found" }, { status: 400 })
    }

    sendMail({ email, emailType: "Reset", userId: user._id });

    return NextResponse.json({ success: true, message: "Check Your email Inbox" }, { status: 200 })

  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "Failed to fetch user from this email" }, { status: 505 })
  }
}