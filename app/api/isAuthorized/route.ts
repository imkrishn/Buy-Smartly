import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // Auth.js token
    const authToken = await getToken({ req, secret: process.env.AUTH_SECRET });

    // Custom token
    const customCookie = req.cookies.get("token")?.value || "";
    const customToken = customCookie
      ? (jwt.verify(customCookie, process.env.TOKEN_SECRET!) as JwtPayload)
      : null;

    const token = authToken || customToken;


    if (token) {
      return NextResponse.json({ status: true, token });
    } else {
      return NextResponse.json({ status: false });
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ status: false });
  }
}
