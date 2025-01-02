import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest) {
  await connect()

  try {
    const { searchParams } = new URL(request.url);


    const userId = searchParams.get("email");

    await User.deleteOne({ email: userId });

    const res = NextResponse.json({ status: true, message: "Account deleted Succesfully" });

    res.cookies.set('token', '', {
      expires: new Date(0),        // Expire the cookie immediately
      httpOnly: true,
      path: '/',
    });

    return res
  } catch (err) {
    console.log(err);
    return NextResponse.json({ status: false, message: "Account deletion failed" })

  }
}