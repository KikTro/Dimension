import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePrintPrice } from "@/lib/pricing-calculator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      volumeCm3,
      infillPercent = 20,
      materialName,
      supports = false,
      layerHeight = "0.16mm",
      quantity = 1,
      isRush = false,
    } = body;

    if (!volumeCm3 || volumeCm3 <= 0) {
      return NextResponse.json(
        { error: "Valid model volume in cm3 is required" },
        { status: 400 }
      );
    }

    // Fetch active pricing settings from DB
    const settings = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Pricing configuration not found" },
        { status: 500 }
      );
    }

    // Fetch material from DB
    let material = null;
    if (materialName) {
      material = await prisma.material.findFirst({
        where: {
          name: { contains: materialName },
          active: true,
        },
      });
    }

    if (!material) {
      // Fallback to first active material
      material = await prisma.material.findFirst({
        where: { active: true },
      });
    }

    const materialPricePerKg = material ? material.pricePerKg : 900.0;
    const materialDensity = material ? material.density : 1.24;

    const calculation = calculatePrintPrice({
      volumeCm3: Number(volumeCm3),
      infillPercent: Number(infillPercent) || 20,
      materialPricePerKg,
      materialDensity,
      supports: Boolean(supports),
      layerHeight,
      quantity: Math.max(1, Number(quantity) || 1),
      isRush: Boolean(isRush),
      settings: {
        id: settings.id,
        minimumCharge: settings.minimumCharge,
        machineFee: settings.machineFee,
        supportFee: settings.supportFee,
        finishingFee: settings.finishingFee,
        packagingFee: settings.packagingFee,
        shippingFee: settings.shippingFee,
        rushMultiplier: settings.rushMultiplier,
      },
    });

    return NextResponse.json({
      ...calculation,
      materialUsed: material?.name || "Standard PLA",
      materialPricePerKg,
    });
  } catch (error) {
    console.error("Price calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate print price" },
      { status: 500 }
    );
  }
}
