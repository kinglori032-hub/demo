import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateCheckoutForm, validateCreateProduct } from "@/lib/validation";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/auth";
import type { ApiResponse, Order, CreateOrderRequest } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Order[]>>> {
  try {
    console.log("[GET /api/orders] Checking admin authentication");
    
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      console.warn("[GET /api/orders] Unauthorized - admin not authenticated");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[GET /api/orders] Fetching all orders");
    const orders = await prisma.order.findMany({
      include: {
  orderItems: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  },
},
      orderBy: { createdAt: "desc" },
    });

    console.log(`[GET /api/orders] Found ${orders.length} orders`);
    return NextResponse.json({
      success: true,
      data: orders as any,
    });
  } catch (error) {
    console.error("[GET /api/orders] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const body = await request.json() as CreateOrderRequest;

    // Validate checkout data
    const validation = validateCheckoutForm(body);

    console.log("[POST /api/orders] Validation attempt");
    console.log("[POST /api/orders] Incoming payload:", JSON.stringify(body, null, 2));
    console.log("[POST /api/orders] Validation result:", JSON.stringify(validation, null, 2));

    if (!validation.success) {
      console.warn("[POST /api/orders] Validation failed with errors:", validation.errors);
      
      // Format error messages for user
      const errorMessages: string[] = [];
      if (validation.errors) {
        for (const [field, messages] of Object.entries(validation.errors)) {
          if (messages && Array.isArray(messages) && messages.length > 0) {
            const message = messages[0];
            if (message) {
              errorMessages.push(message);
            }
          }
        }
      }
      
      const userFriendlyError = errorMessages.length > 0 
        ? errorMessages.join(". ")
        : "Please check your information and try again.";
      
      return NextResponse.json(
        { success: false, error: userFriendlyError },
        { status: 400 }
      );
    }

    console.log("[POST /api/orders] Validation passed ✓");

    // Validate items exist and have stock
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart cannot be empty" },
        { status: 400 }
      );
    }

    // Check product existence and stock
    let total = 0;
    const orderItemsData = [];

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      total += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: body.customerName,
        phone: body.phone,
        email: body.email || null,
        city: body.city,
        address: body.address,
        notes: body.notes || null,
        paymentMethod: "cash_on_delivery",
        total,
        status: "pending",
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`[POST /api/orders] Order created successfully: ${order.id}`);

    // Reduce stock for each product
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(
      { success: true, data: order as any },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/orders] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
