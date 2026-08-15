import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminApi } from "@/lib/auth";

export async function GET(request: Request) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!verifyAdminApi(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } catch (err) {
    return NextResponse.json({ error: "Failed to update pricing settings" }, { status: 500 });
  }
}
