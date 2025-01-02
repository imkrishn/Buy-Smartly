import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from 'jose'

const protectedRoutes = ["/cart", "/profile", "/admin", "/order", "/payment-success"];
const guestRoutes = ["/auth/login", "/auth/signup"];

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

export async function middleware(req: NextRequest) {

  const authToken = await getToken({ req, secret: process.env.AUTH_SECRET });

  const customToken = req.cookies.get("token")?.value || '';
  let customVerifiedToken = null;

  if (customToken) {
    try {
      customVerifiedToken = await jwtVerify(customToken as string, secret);
    } catch (error) {
      customVerifiedToken = null;
    }
  } else {
    console.warn("No token provided.");
  }

  const token = authToken || customVerifiedToken;
  const { pathname } = req.nextUrl;




  // Protect authenticated routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  if (guestRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      console.log(`Guest route "${pathname}" accessed by authenticated user.`);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/order/:path*",
    "/auth/login",
    "/auth/signup",

  ],
};
