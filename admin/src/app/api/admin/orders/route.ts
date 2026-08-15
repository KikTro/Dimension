import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminApi } from "@/lib/auth";

export async function GET(request: Request) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = orders.map((o: any) => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
