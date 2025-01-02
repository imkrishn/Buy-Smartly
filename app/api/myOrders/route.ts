import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import Image from "@/models/productImageModel";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

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

    const orders = await Order.find({ userId: user._id }); // Find all orders for the user

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: "No orders found" });
    }

    // Collect product IDs from all orders
    const productId = orders.flatMap((order: any) =>
      order.orderItems.map((item: any) => item.productId)
    );

    // Fetch the products
    const products = await Product.find({ _id: { $in: productId } });

    // Extract the productImages IDs from the products
    const productImageIds = products.flatMap((product: any) => product.productImages);

    // Fetch images using the extracted productImages IDs
    const images = await Image.find({ _id: { $in: productImageIds } });

    // Map the images back to the products
    const productsWithImages = products.map((product: any) => {
      const productImages = product.productImages.map((imageId: any) =>
        images.find((image: any) => image._id.toString() === imageId.toString())
      );

      return {
        ...product.toObject(),
        productImages: productImages.filter(Boolean), // Filter out null/undefined images
      };
    });

    // Combine orders with their respective products, including address and status
    const ordersWithDetails = orders.map((order: any) => {
      const orderProducts = order.orderItems.map((item: any) => {
        const product = productsWithImages.find(
          (prod: any) => prod._id.toString() === item.productId.toString()
        );

        return {
          ...item,
          product, // Attach the product with images to the order item
        };
      });

      return {
        ...order.toObject(),
        orderItems: orderProducts, // Replace orderItems with detailed products
        address: order.address, // Include order address
        status: order.status,   // Include order status
      };
    });

    // Return the response
    return NextResponse.json({ success: true, orders: ordersWithDetails });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch your orders" },
      { status: 500 }
    );
  }
}
