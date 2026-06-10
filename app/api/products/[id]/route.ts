import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateCreateProduct } from "@/lib/validation";
import { isAdminAuthenticated } from "@/lib/auth";
import type { ApiResponse, Product } from "@/lib/types";
import type { CreateProductType } from "@/lib/validation";

/* ---------------- GET PRODUCT ---------------- */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("[GET /api/products/[id]] error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* ---------------- UPDATE PRODUCT ---------------- */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = validateCreateProduct(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          data: validation.errors as any,
        },
        { status: 400 }
      );
    }

    const data = validation.data as CreateProductType;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        stock: data.stock,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("[PUT /api/products/[id]] error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* ---------------- DELETE PRODUCT ---------------- */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
  
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("[DELETE /api/products/[id]] error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}