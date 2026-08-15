import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "All") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const parsed = orders.map((o) => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerName, customerEmail, customerPhone, customerAddress, notes } = body;

    if (!items || !items.length || !customerName || !customerEmail || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { error: "Items and complete customer contact information are required" },
        { status: 400 }
      );
    }

    // Retrieve settings for packaging & shipping
    const settings = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });

    const packagingFee = settings ? settings.packagingFee : 30.0;
    const shippingFee = settings ? settings.shippingFee : 70.0;

    let itemsTotal = 0;
    for (const item of items) {
      itemsTotal += (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1);
    }

    const totalAmount = Number((itemsTotal + packagingFee + shippingFee).toFixed(2));
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        items: JSON.stringify(items),
        totalAmount,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        notes: notes || "",
        status: "Pending",
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        ...newOrder,
        items: JSON.parse(newOrder.items),
      },
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
