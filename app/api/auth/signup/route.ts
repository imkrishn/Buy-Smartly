import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';


connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { fullName, email, dob, mobileNumber, password } = reqBody;
    const user = await User.findOne({
      $or: [{ email }, { mobileNumber }]
    });

    if (user) throw new Error("User already exists.");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      dateOfBirth: dob,
      mobileNumber,
      password: hashedPassword,
      salt: salt,
      isVerified: false
    });

    // Save the new user to the database
    await newUser.save();



    return NextResponse.json({
      status: 201,
      message: "User created successfully.",
      success: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
