import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import type { ApiResponse, Order, UpdateOrderStatusRequest } from "@/lib/types";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const isAdmin = await isAdminAuthenticated();

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ FIXED: required in Next.js 15+
    const { id } = await params;

    const body = (await request.json()) as UpdateOrderStatusRequest;

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: order as any,
    });
  } catch (error) {
    console.error("PATCH /api/orders/[id]/status error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}