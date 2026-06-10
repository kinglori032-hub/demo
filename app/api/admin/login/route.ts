import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, createAdminSession } from "@/lib/auth";
import { validateAdminLogin } from "@/lib/validation";
import type { ApiResponse } from "@/lib/types";

interface LoginRequest {
  password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  try {
    const body = (await request.json()) as LoginRequest;
    const validation = validateAdminLogin(body);

    if (!validation.success) {
      console.warn("[Login] Validation failed:", validation.errors);
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    // Type guard: validation.success is true, so validation.data exists
    const isValid = await verifyAdminPassword(validation.data.password);
    if (!isValid) {
      console.warn("[Login] Invalid password attempt");
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await createAdminSession();
    console.log(`[Login] New session created: ${token.substring(0, 8)}...`);

    return NextResponse.json({
      success: true,
      data: { success: true },
      message: "Login successful",
    });
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
