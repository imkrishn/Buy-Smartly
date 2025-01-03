import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function GET(req: NextRequest) {
  try {
    const token: any = await getDataFromToken(req);




    if (!token) {
      return NextResponse.json({ success: false, message: "Failed to fetch token" }, { status: 404 });
    }

    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Token is expired or invalid with", token }, { status: 401 });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: "User is not registered" }, { status: 404 });
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || !cart.items.length) {
      return NextResponse.json({ success: false, message: "User has no items in cart" }, { status: 400 });
    }
    const count = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);

    return NextResponse.json({ success: true, count }, { status: 200 });


  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false }, { status: 505 })

  }
}