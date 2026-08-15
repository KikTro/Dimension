import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "asc" },
    });

    const parsed = materials.map((m) => ({
      ...m,
      colors: typeof m.colors === "string" ? JSON.parse(m.colors) : m.colors,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
