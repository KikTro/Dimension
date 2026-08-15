import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
      materials: typeof product.materials === "string" ? JSON.parse(product.materials) : product.materials,
      colors: typeof product.colors === "string" ? JSON.parse(product.colors) : product.colors,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
