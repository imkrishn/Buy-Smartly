import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = NextResponse.json({ message: "loggout successfully" })

    res.cookies.set("token", '', {
      expires: new Date(0),
      httpOnly: true,
      path: "/"
    })

    return res
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "failed to logout" })
  }
}