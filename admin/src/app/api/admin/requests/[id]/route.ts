import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminApi } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } catch (err) {
    return NextResponse.json({ error: "Failed to update print request" }, { status: 500 });
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
    await prisma.printRequest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}
