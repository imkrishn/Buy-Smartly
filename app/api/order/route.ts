import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const reqBody = await req.json();

    // Get user data from token
    const token: any = await getDataFromToken(req);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch token",
        },
        { status: 401 }
      );
    }

    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Token is expired or invalid",
        },
        { status: 403 }
      );
    }

    // Fetch user from database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not registered",
        },
        { status: 404 }
      );
    }

    // Destructure required fields from request body
    const { totalAmount, orderItems, payment_intent, address } = reqBody;

    if (!totalAmount || !orderItems || !payment_intent || !address) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields in the order",
        },
        { status: 400 }
      );
    }

    // Check for duplicate order using `payment_intent`
    const existingOrder = await Order.findOne({ paymentId: payment_intent });

    if (existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order with this payment intent has already been processed",
        },
        { status: 409 } // Conflict
      );
    }

    // Create a new order
    const newOrder = await Order.create({
      userId: user._id,
      address,
      totalAmount,
      orderItems,
      paymentId: payment_intent,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Order placement failed",
      },
      { status: 500 }
    );
  }
}
