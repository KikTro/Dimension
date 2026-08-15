import { NextResponse } from "next/server";
import { SEED_MATERIALS, SEED_PRICING_SETTINGS } from "@/lib/seed-data";
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

    // Try database first, fall back to static data
    let settings: any = SEED_PRICING_SETTINGS;
    let material: any = null;

    try {
      const { prisma } = await import("@/lib/prisma");

      const dbSettings = await prisma.pricingSettings.findUnique({
        where: { id: "default" },
      });
      if (dbSettings) {
        settings = dbSettings;
      }

      if (materialName) {
        material = await prisma.material.findFirst({
          where: {
            name: { contains: materialName },
            active: true,
          },
        });
      }

      if (!material) {
        material = await prisma.material.findFirst({
          where: { active: true },
        });
      }
    } catch {
      // Database unavailable — use static seed data
      console.warn("Database unavailable for price calculation, using static data");
      if (materialName) {
        material = SEED_MATERIALS.find((m) => m.name.includes(materialName));
      }
      if (!material) {
        material = SEED_MATERIALS[0];
      }
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
