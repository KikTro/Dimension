import { NextResponse } from "next/server";
import { SEED_PRODUCTS } from "@/lib/seed-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const material = searchParams.get("material");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const adminMode = searchParams.get("admin") === "true";

    let parsed: any[];

    try {
      const { prisma } = await import("@/lib/prisma");

      const where: any = {};
      if (!adminMode) {
        where.active = true;
      }
      if (category && category !== "All") {
        where.category = category;
      }
      if (featured === "true") {
        where.featured = true;
      }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { sku: { contains: search } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      parsed = products.map((p) => {
        const parsedMaterials: string[] = typeof p.materials === "string" ? JSON.parse(p.materials) : p.materials;
        return {
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
          materials: parsedMaterials,
          colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
        };
      });
    } catch {
      // Database unavailable — use static seed data
      console.warn("Database unavailable for products, using static data");
      parsed = SEED_PRODUCTS.filter((p) => adminMode || p.active);

      if (category && category !== "All") {
        parsed = parsed.filter((p) => p.category === category);
      }
      if (featured === "true") {
        parsed = parsed.filter((p) => p.featured);
      }
      if (search) {
        const q = search.toLowerCase();
        parsed = parsed.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }
    }

    // Filter by material in memory if needed
    let filtered = parsed;
    if (material && material !== "All") {
      filtered = parsed.filter((p: any) =>
        p.materials.some((m: string) => m.toLowerCase().includes(material.toLowerCase()))
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
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
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
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
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
