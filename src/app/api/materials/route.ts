import { NextResponse } from "next/server";
import { SEED_MATERIALS } from "@/lib/seed-data";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "asc" },
    });

    const parsed = materials.map((m) => ({
      ...m,
      colors: typeof m.colors === "string" ? JSON.parse(m.colors) : m.colors,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.warn("Database unavailable, serving static materials:", error);
    return NextResponse.json(SEED_MATERIALS);
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { name, pricePerKg, density, colors, description, nozzleTemp, bedTemp, tensile, impact, active } = body;

    if (!name || pricePerKg === undefined) {
      return NextResponse.json({ error: "Name and pricePerKg are required" }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        name,
        pricePerKg: Number(pricePerKg),
        density: Number(density) || 1.24,
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        description: description || "",
        nozzleTemp: nozzleTemp || null,
        bedTemp: bedTemp || null,
        tensile: tensile || null,
        impact: impact || null,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({
      ...material,
      colors: JSON.parse(material.colors),
    });
  } catch (error) {
    console.error("Failed to create material:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
