import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/productModel";
import Image from "@/models/productImageModel"; // Import the new Image model
import { connect } from "@/dbConfig/dbConfig"; // Your DB connection logic

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;         // Unique identifier for the uploaded resource
  url: string;               // HTTP URL of the uploaded file
  secure_url: string;        // HTTPS URL of the uploaded file
  resource_type: string;     // Type of resource (e.g., "image", "video")
  format: string;            // File format (e.g., "jpg", "png")
  bytes: number;             // File size in bytes
  width: number;             // Width of the image (if applicable)
  height: number;            // Height of the image (if applicable)
  created_at: string;        // Timestamp of when the upload was completed
  folder: string;            // Folder where the file is stored (if applicable)
  tags?: string[];           // Tags associated with the resource
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const productName = formData.get("productName") as string;
    const productDescription = formData.get("productDescription") as string;
    const productRating = parseFloat(formData.get("productRating") as string);
    const productTotalPrice = parseFloat(formData.get("productTotalPrice") as string);
    const productSalePrice = parseFloat(formData.get("productSalePrice") as string);
    const productCategory = formData.get("productCategory") as string;
    const productImages = formData.getAll("productImages") as File[];

    if (!productName || !productDescription || !productCategory || !productImages.length) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connect();

    // Upload images to Cloudinary and save in the Image collection
    const imageIds = await Promise.all(
      productImages.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products-images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as any);
            }
          );
          uploadStream.end(buffer);
        });

        const newImage = await Image.create({
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
        });

        return newImage._id; // Return the ObjectId of the saved image
      })
    );

    // Create a new product with the saved image IDs
    const product = await Product.create({
      productName,
      productDescription,
      productRating,
      productTotalPrice,
      productSalePrice,
      productCategory,
      productImages: imageIds, // Store ObjectIds in the product schema
    });

    return NextResponse.json({
      message: "Product uploaded successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    return NextResponse.json({ message: "Failed to upload product" }, { status: 500 });
  }
}

