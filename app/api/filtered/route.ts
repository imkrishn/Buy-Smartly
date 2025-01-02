import { connect } from "@/dbConfig/dbConfig";
import Image from "@/models/productImageModel";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect();

interface ProductImage {
  _id: string;
  url: string;
}

interface ProductInterface {
  _id: string;
  productName: string;
  productDescription: string;
  productRating: number;
  productTotalPrice: number;
  productSalePrice: number;
  productImages: ProductImage[];  // Associating images with the product
}

export async function GET(req: NextRequest) {
  try {
    // Extract the filteredPrice from query params
    const url = new URL(req.url);
    const filteredPrice = url.searchParams.get("filteredPrice");

    if (!filteredPrice) {
      return NextResponse.json({ success: false, message: "No filter price provided" }, { status: 400 });
    }

    let priceFilter: Record<string, any> = {};

    // Apply filter based on price range
    switch (filteredPrice) {
      case 'Less_than_100':
        priceFilter = { productSalePrice: { $lt: 100 } };
        break;
      case '100_1000':
        priceFilter = { productSalePrice: { $gte: 100, $lte: 1000 } };
        break;
      case 'More_than_1000':
        priceFilter = { productSalePrice: { $gt: 1000 } };
        break;
      default:
        return NextResponse.json({ success: false, message: "Invalid filter price" }, { status: 400 });
    }

    // Find products based on the price filter
    const products = await Product.aggregate([
      { $match: priceFilter },  // Filter products by price
      { $sample: { size: 12 } },  // Sample 12 random products
    ]);

    // Extract the productImages IDs from the products
    const productImageIds = products.flatMap((product: any) => product.productImages);

    // Fetch images using the extracted productImages IDs
    const images = await Image.find({ _id: { $in: productImageIds } });

    // Map the images back to the products based on matching IDs
    const productsWithImages: ProductInterface[] = products.map((product: any) => {
      // Map the image URLs to the product
      const productImages = product.productImages.map((imageId: any) => {
        return images.find((image) => image._id.toString() === imageId.toString());
      });

      // Return the product with the images attached
      return {
        _id: product._id.toString(),
        productName: product.productName,
        productDescription: product.productDescription,
        productRating: product.productRating,
        productTotalPrice: product.productTotalPrice,
        productSalePrice: product.productSalePrice,
        productImages: productImages.filter(Boolean) as ProductImage[],  // Ensure correct type
      };
    });

    return NextResponse.json({ success: true, data: productsWithImages });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "Failed to get the filtered data" }, { status: 505 });
  }
}
