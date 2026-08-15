import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.pricingSettings.create({
        data: {
          id: "default",
          minimumCharge: 150.0,
          machineFee: 45.0,
          supportFee: 25.0,
          finishingFee: 20.0,
          packagingFee: 30.0,
          shippingFee: 70.0,
          rushMultiplier: 1.35,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch pricing settings:", error);
    return NextResponse.json({ error: "Failed to fetch pricing settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      minimumCharge,
      machineFee,
      supportFee,
      finishingFee,
      packagingFee,
      shippingFee,
      rushMultiplier,
    } = body;

    const updated = await prisma.pricingSettings.upsert({
      where: { id: "default" },
      update: {
        minimumCharge: Number(minimumCharge) || 150.0,
        machineFee: Number(machineFee) || 0,
        supportFee: Number(supportFee) || 0,
        finishingFee: Number(finishingFee) || 0,
        packagingFee: Number(packagingFee) || 0,
        shippingFee: Number(shippingFee) || 0,
        rushMultiplier: Number(rushMultiplier) || 1.0,
      },
      create: {
        id: "default",
        minimumCharge: Number(minimumCharge) || 150.0,
        machineFee: Number(machineFee) || 0,
        supportFee: Number(supportFee) || 0,
        finishingFee: Number(finishingFee) || 0,
        packagingFee: Number(packagingFee) || 0,
        shippingFee: Number(shippingFee) || 0,
        rushMultiplier: Number(rushMultiplier) || 1.0,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update pricing settings:", error);
    return NextResponse.json({ error: "Failed to update pricing settings" }, { status: 500 });
  }
}
