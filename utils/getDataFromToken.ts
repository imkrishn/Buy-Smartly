import jwt, { JwtPayload } from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';


export const getDataFromToken = async (req: NextRequest) => {
  try {
    // Auth.js token
    const authToken = await getToken({ req, secret: process.env.AUTH_SECRET }) || null;

    // Custom token
    const customCookie = req.cookies.get("token")?.value || "";
    const customToken = customCookie
      ? (jwt.verify(customCookie, process.env.TOKEN_SECRET!) as JwtPayload)
      : null;

    if (!authToken && !customToken) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized: Token is invalid or expired",
      });
    }

    const token = authToken || customToken;

    return token
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch token",
    });


  }
}

