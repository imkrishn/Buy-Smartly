import { connect } from "@/dbConfig/dbConfig";
import Cart from "@/models/cartModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
import User from "@/models/userModel";
import Product from "@/models/productModel";
import Image from "@/models/productImageModel";

connect();

export async function GET(req: NextRequest) {
  try {
    const token: any = await getDataFromToken(req);

    if (!token) {
      return NextResponse.json({ success: false, message: "Failed to fetch token" });
    }

    const userEmail = token?.email;

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Token is expired or invalid" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ success: false, message: "User is not registered" });
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || !cart.items.length) {
      return NextResponse.json({ success: false, message: "User has no items in cart" });
    }

    // Extract product IDs and quantities from the cart
    const cartItemsMap = cart.items.reduce((acc: any, item: any) => {
      acc[item.productId.toString()] = item.quantity; // Map productId to quantity
      return acc;
    }, {});
    const cartItemsId = Object.keys(cartItemsMap);

    // Fetch products from the database
    const products = await Product.find({
      _id: { $in: cartItemsId },
    });

    // Extract productImage IDs from the products
    const productImageIds = products.flatMap((product) => product.productImages);

    // Fetch images using the extracted productImage IDs
    const images = await Image.find({ _id: { $in: productImageIds } });

    // Map images and quantities to products
    const productsWithDetails = products.map((product) => {
      // Attach images
      const productImages = product.productImages.map((imageId: any) => {
        return images.find((image) => image._id.toString() === imageId.toString());
      });

      // Attach quantity
      const quantity = cartItemsMap[product._id.toString()] || 0;

      return {
        ...product.toObject(), // Convert Mongoose document to plain object
        productImages: productImages.filter(Boolean), // Remove nulls if no matching image is found
        quantity, // Add quantity
      };
    });

    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      data: productsWithDetails
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return NextResponse.json({ success: false, message: "Failed to get cart" });
  }
}
