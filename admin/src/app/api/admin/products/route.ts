import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminApi } from "@/lib/auth";

export async function GET(request: Request) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = products.map((p: any) => ({
      ...p,
      images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
      materials: typeof p.materials === "string" ? JSON.parse(p.materials) : p.materials,
      colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      category,
      images,
      materials,
      colors,
      dimensions,
      printTime,
      sku,
      featured,
      active,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const generatedSku =
      sku ||
      `DIM-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || "",
        price: Number(price),
        category,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        materials: typeof materials === "string" ? materials : JSON.stringify(materials || []),
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        dimensions: dimensions || "100 × 100 × 50 mm",
        printTime: printTime || "2h 00m",
        sku: generatedSku,
        featured: Boolean(featured),
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
      materials: JSON.parse(product.materials),
      colors: JSON.parse(product.colors),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
