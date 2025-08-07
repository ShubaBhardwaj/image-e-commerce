import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().lean();
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 201 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}




export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body: IProduct = await request.json();

    if (
        !body.name ||
        !body.imageUrl ||
        !body.variants ||
        body.variants.length === 0
    ) {
        return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // Validate variants
    for (const variant of body.variants) {
      if (!variant.type || !variant.price || !variant.license) {
        return NextResponse.json(
          { error: "Invalid variant data" },
          { status: 400 }
        );
      }
    }

    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}








