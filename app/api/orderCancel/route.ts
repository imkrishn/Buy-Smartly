import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
  try {
    const token: any = await getDataFromToken(req);
    const { orderId } = await req.json();

    if (!token || !orderId) {
      return NextResponse.json({ success: false, message: "Failed to fetch token or orderiD" });
    }

    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Token is expired or invalid" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: "User is not registered" });
    }

    const order = await Order.findOne({ userId: user._id, _id: orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = "cancelled";

    await order.save();


    return NextResponse.json({ success: true, message: "Order get cancelled" })

  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "Failed to cancelled the item" })

  }
}