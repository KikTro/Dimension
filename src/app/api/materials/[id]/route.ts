import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, pricePerKg, density, colors, description, nozzleTemp, bedTemp, tensile, impact, active } = body;

    const updated = await prisma.material.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(pricePerKg !== undefined && { pricePerKg: Number(pricePerKg) }),
        ...(density !== undefined && { density: Number(density) }),
        ...(colors !== undefined && { colors: typeof colors === "string" ? colors : JSON.stringify(colors) }),
        ...(description !== undefined && { description }),
        ...(nozzleTemp !== undefined && { nozzleTemp }),
        ...(bedTemp !== undefined && { bedTemp }),
        ...(tensile !== undefined && { tensile }),
        ...(impact !== undefined && { impact }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return NextResponse.json({
      ...updated,
      colors: typeof updated.colors === "string" ? JSON.parse(updated.colors) : updated.colors,
    });
  } catch (error) {
    console.error("Failed to update material:", error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.material.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete material:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
