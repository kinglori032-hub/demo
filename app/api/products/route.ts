import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateCreateProduct, validateAdminLogin } from "@/lib/validation";
import { isAdminAuthenticated } from "@/lib/auth";
import type { ApiResponse, Product} from "@/lib/types";
import type { CreateProductType } from "@/lib/validation";

export async function GET(): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    console.log("[GET /api/products] Fetching all products");
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`[GET /api/products] Found ${products.length} products`);
    products.forEach((p: { id: any; name: any; stock: any; }, idx: number) => {
  console.log(
    `[GET /api/products] Product ${idx + 1}: ID="${p.id}" (type: ${typeof p.id}), Name="${p.name}", Stock=${p.stock}`
  );
});
    

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("[GET /api/products] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    console.log("[POST /api/products] Starting product creation");
    
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      console.warn("[POST /api/products] Unauthorized - admin not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[POST /api/products] Admin authenticated, parsing request body");
    const body = await request.json();
    const validation = validateCreateProduct(body);

    if (!validation.success) {
      console.warn("[POST /api/products] Validation failed:", validation.errors);
      const errorMessages = Object.entries(validation.errors || {})
        .map(([field, errors]) => `${field}: ${errors?.join(", ") || "Invalid"}`)
        .join("; ");
      return NextResponse.json(
        { success: false, error: errorMessages || "Validation failed", data: validation.errors as any },
        { status: 400 }
      );
    }

    const data = validation.data as CreateProductType;
    console.log(`[POST /api/products] Creating product: ${data.name}`);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        stock: data.stock,
      },
    });

    console.log(`[POST /api/products] Product created successfully: ${product.id}`);
    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/products] Error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { success: false, error: "Product name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
