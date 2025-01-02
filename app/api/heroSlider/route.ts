import { connect } from "@/dbConfig/dbConfig";
import Image from "@/models/productImageModel";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {

    const sliderImages = await Image.find({ isSlider: true }) || [];


    const sliderImagesMap = new Map(
      sliderImages.map((item) => [item._id.toString(), item.url])
    );

    const products = await Product.find({
      productImages: { $in: Array.from(sliderImagesMap.keys()) },
    }).select('_id productImages'); // Only select the _id and productImages fields

    // Map the product images to their corresponding URLs
    const productsWithImages = products.map((product) => {
      const productImageUrls = product.productImages.map((imageId: any) => {
        const url = sliderImagesMap.get(imageId.toString());
        return url ? { imageId, url } : null;
      }).filter(Boolean);

      return {
        _id: product._id,
        productImages: productImageUrls,
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithImages,
    });
  } catch (err) {
    console.error("Error fetching products: ", err);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch products with slider images.",
    });
  }
}
