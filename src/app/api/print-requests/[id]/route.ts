import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, estimatedPrice } = body;

    const updated = await prisma.printRequest.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(estimatedPrice !== undefined && { estimatedPrice: Number(estimatedPrice) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update print request:", error);
    return NextResponse.json(
      { error: "Failed to update print request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.printRequest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete print request:", error);
    return NextResponse.json(
      { error: "Failed to delete print request" },
      { status: 500 }
    );
  }
}
