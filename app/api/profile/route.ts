import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { decryptEmail } from "@/utils/cipherText";
import { NextRequest, NextResponse } from "next/server";

connect();
const secretKey = "immrcool@guyr-dfg4-fddf45d-ddcv2"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const encodedUserId = searchParams.get("profileId");

    const userId = decodeURIComponent(encodedUserId!);

    if (!userId) {
      return NextResponse.json(
        { error: "profileId is required" },
        { status: 400 }
      );
    }

    const decryptedId = decryptEmail(userId, process.env.CIPHER_SECRET! || secretKey);

    const user = await User.findOne({ email: decryptedId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
