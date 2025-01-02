import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function GET(req: NextRequest) {
  try {
    const productId = req.headers.get("itemId");
    const quantity = req.headers.get("quantity");
    const token: any = await getDataFromToken(req);

    if (!productId || !quantity || !token) {
      return NextResponse.json(
        { success: false, message: "Product ID, quantity, and token are required." },
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
    const parsedQuantity = Number(quantity);

    if (isNaN(parsedQuantity)) {
      return NextResponse.json(
        { success: false, message: "Invalid quantity value." },
        { status: 400 }
      );
    }

    if (parsedQuantity <= 0) {
      // Remove the product from the cart
      const result = await Cart.updateOne(
        { userId: userId },
        { $pull: { items: { productId: productId } } }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { success: false, message: "Product not found in the cart or not authorized." },
          { status: 404 }
        );
      }
    } else {
      // Update the product quantity in the cart
      const result = await Cart.updateOne(
        { userId: userId, "items.productId": productId },
        { $set: { "items.$.quantity": parsedQuantity } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: "Product not found in the cart or not authorized." },
          { status: 404 }
        );
      }

    }

    return NextResponse.json(
      { success: true, message: "Cart updated successfully.", quantity: parsedQuantity },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating cart item:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update cart item." },
      { status: 500 }
    );
  }
}
