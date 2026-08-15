import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminApi } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category }),
        ...(images !== undefined && { images: typeof images === "string" ? images : JSON.stringify(images) }),
        ...(materials !== undefined && { materials: typeof materials === "string" ? materials : JSON.stringify(materials) }),
        ...(colors !== undefined && { colors: typeof colors === "string" ? colors : JSON.stringify(colors) }),
        ...(dimensions !== undefined && { dimensions }),
        ...(printTime !== undefined && { printTime }),
        ...(sku !== undefined && { sku }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return NextResponse.json({
      ...updated,
      images: typeof updated.images === "string" ? JSON.parse(updated.images) : updated.images,
      materials: typeof updated.materials === "string" ? JSON.parse(updated.materials) : updated.materials,
      colors: typeof updated.colors === "string" ? JSON.parse(updated.colors) : updated.colors,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
