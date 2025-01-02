import { connect } from "@/dbConfig/dbConfig";
import Address from "@/models/addressModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function POST(req: NextRequest) {
  try {

    const token: any = await getDataFromToken(req);
    const reqBody = await req.json()
    const newAddress = reqBody?.newAddress;
    const name = reqBody?.name;
    const pinCode = reqBody?.pinCode;
    const mobileNumber = reqBody?.mobileNumber;


    console.log(newAddress, name, pinCode, mobileNumber);



    if (!token || !newAddress || !name || !pinCode || !mobileNumber) {
      return NextResponse.json(
        { success: false, message: "newAddress and token are required." },
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

    const address = await Address.findOne({ userId });

    if (!address) {
      await Address.create({ userId, name, newAddress, pinCode, mobileNumber })
    } else {
      await Address.updateOne(
        { userId },
        { $set: { name, newAddress, pinCode, mobileNumber } }
      );
    }

    return NextResponse.json({ succes: true, message: "Address updated successfully.", address })

  } catch (err) {
    console.log(err);
    return NextResponse.json({ succes: false, message: "Failed to update Address" })

  }
}