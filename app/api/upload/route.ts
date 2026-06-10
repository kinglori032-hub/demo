import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important for stability on Vercel

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // safer filename handling
    const safeName = file.name?.replace(/\s+/g, "_") || "upload";

    const blob = await put(`${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Upload failed",
      },
      { status: 500 }
    );
  }
}