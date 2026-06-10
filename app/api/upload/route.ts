import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.split(" ").join("_")}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}