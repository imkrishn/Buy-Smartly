import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Image from "@/models/productImageModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("productId");


    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    const product = await Product.findOne({ _id: itemId });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const productImageIds = product.productImages || [];
    const images = await Image.find({ _id: { $in: productImageIds } });

    const productWithImages = {
      ...product.toObject(),
      productImages: productImageIds.map((imageId: any) => {
        return images.find((image) => image._id.toString() === imageId.toString());
      }).filter(Boolean),
    };

    return NextResponse.json({ success: true, item: productWithImages });
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}
