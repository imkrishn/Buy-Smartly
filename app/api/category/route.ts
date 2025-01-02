import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Image from "@/models/productImageModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    await connect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");


    if (!categoryId) {
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    let products = []

    if (categoryId === "Men" || categoryId === "Women" || categoryId === "Kids") {
      products = await Product.aggregate([
        { $match: { productCategory: categoryId } },
        { $sample: { size: 12 } } //  12 products
      ]);
    } else {
      products = await Product.find({
        productName: { $regex: new RegExp(categoryId, 'i') }
      });

      products = products.map((item) => item._doc);

    }

    if (products.length === 0) {
      return NextResponse.json({ success: false, message: "No products found for this ." }, { status: 404 });
    }


    const productImageIds = products.flatMap((product) => product.productImages);

    const images = await Image.find({ _id: { $in: productImageIds } });

    const productsWithImages = products.map((product) => {
      const productImages = product.productImages.map((imageId: any) => {
        return images.find((image) => image._id.toString() === imageId.toString());
      });

      return {
        ...product,  // No need to call .toObject() here, as `product` is already a plain object
        productImages: productImages.filter(Boolean),  // Remove nulls if no matching image is found
      };
    });


    return NextResponse.json({ success: true, products: productsWithImages });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}
