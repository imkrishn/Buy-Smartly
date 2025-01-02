import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import Image from "@/models/productImageModel";


connect();

export async function GET() {
  try {
    // Fetch 12 random products
    const randomProducts = await Product.aggregate([{ $sample: { size: 12 } }]);

    // Extract the productImages IDs from the products
    const productImageIds = randomProducts.flatMap((product) => product.productImages);

    // Fetch images using the extracted productImages IDs
    const images = await Image.find({ _id: { $in: productImageIds } });

    // Map the images back to the products based on matching IDs
    const productsWithImages = randomProducts.map((product) => {
      // Map the image URLs to the product
      const productImages = product.productImages.map((imageId: any) => {
        return images.find((image) => image._id.toString() === imageId.toString());
      });

      // Return the product with the images attached
      return {
        ...product,  // No need to call .toObject() here, as `product` is already a plain object
        productImages: productImages.filter(Boolean),  // Remove nulls if no matching image is found
      };
    });

    return new Response(JSON.stringify(productsWithImages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
