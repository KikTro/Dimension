import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { parseSTL } from "@/lib/stl-parser";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalName = file.name;
    const extension = path.extname(originalName).toLowerCase();
    const allowedExtensions = [".stl", ".3mf", ".obj", ".png", ".jpg", ".jpeg", ".webp"];

    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        {
          error: `Invalid file format (${extension}). Supported 3D formats: .STL, .3MF, .OBJ. Supported images: .PNG, .JPG, .WEBP`,
        },
        { status: 400 }
      );
    }

    // 50MB max file size
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File exceeds 50MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${uniqueFileName}`;

    let geometry = null;
    if (extension === ".stl") {
      try {
        const parsed = parseSTL(bytes);
        geometry = parsed.geometry;
      } catch (err) {
        console.warn("Failed to parse STL geometry on server:", err);
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: originalName,
      fileSize: file.size,
      geometry,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}
