import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartModel";
import User from "@/models/userModel";
import { getToken } from "next-auth/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

connect();

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from URL
    const productId = req.headers.get("productId");

    // Validate input
    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID and cookie are required",
      });
    }

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

    const userEmail = authToken?.email || customToken?.email;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    // If the cart exists, check for the item
    if (cart) {
      const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);

      if (itemIndex !== -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += 1;
        await cart.save();
        return NextResponse.json({
          success: true,
          message: "Item quantity updated",
        });
      } else {
        // Item doesn't exist, create a new item
        cart.items.push({ productId, quantity: 1 });
        await cart.save();
        return NextResponse.json({
          success: true,
          message: "Item added to cart",
        });
      }
    } else {
      // If the cart doesn't exist, create a new one
      const newCart = new Cart({
        userId,
        user: userId,
        items: [{ productId, quantity: 1 }],
      });
      await newCart.save();
      return NextResponse.json({
        success: true,
        message: "New cart created and item added",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to update or add item in cart",
    });
  }
}
