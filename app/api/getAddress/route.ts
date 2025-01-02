import Address from "@/models/addressModel"
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function GET(req: NextRequest) {
  try {
    const token: any = await getDataFromToken(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "token are required." },
        { status: 400 }
      );
    }

    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "User is not verified or expired token." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User is not registered." },
        { status: 400 }
      );
    }

    const userId = user._id;

    const address = await Address.findOne({ userId })

    if (!address) {
      return NextResponse.json(
        { success: false, message: "User has no registered address." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Address fetched successfully", address })

  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "Failed to get the address." })

  }
}