import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePrintPrice } from "@/lib/pricing-calculator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "All") {
      where.status = status;
    }

    const requests = await prisma.printRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch print requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch print requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fileName,
      fileUrl,
      fileSize,
      dimensionsX,
      dimensionsY,
      dimensionsZ,
      volumeCm3,
      triangleCount,
      material,
      color,
      layerHeight,
      infill,
      supports,
      quantity,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      notes,
    } = body;

    if (!fileName || !fileUrl || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "File, customer name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Retrieve settings and material to compute authoritative server-side price
    const settings = await prisma.pricingSettings.findUnique({
      where: { id: "default" },
    });

    const materialRecord = await prisma.material.findFirst({
      where: { name: material },
    });

    const materialPricePerKg = materialRecord ? materialRecord.pricePerKg : 900.0;
    const materialDensity = materialRecord ? materialRecord.density : 1.24;

    const calc = calculatePrintPrice({
      volumeCm3: Number(volumeCm3) || 25.0,
      infillPercent: Number(infill) || 20,
      materialPricePerKg,
      materialDensity,
      supports: Boolean(supports),
      layerHeight: layerHeight || "0.16mm",
      quantity: Math.max(1, Number(quantity) || 1),
      settings: settings || {
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

    const requestNumber = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest = await prisma.printRequest.create({
      data: {
        requestNumber,
        fileName,
        fileUrl,
        fileSize: Number(fileSize) || 0,
        dimensionsX: dimensionsX ? Number(dimensionsX) : null,
        dimensionsY: dimensionsY ? Number(dimensionsY) : null,
        dimensionsZ: dimensionsZ ? Number(dimensionsZ) : null,
        volumeCm3: volumeCm3 ? Number(volumeCm3) : null,
        triangleCount: triangleCount ? Number(triangleCount) : null,
        material: material || "PLA (Standard Precision)",
        color: color || "Matte Black",
        layerHeight: layerHeight || "0.16mm (Standard)",
        infill: Number(infill) || 20,
        supports: Boolean(supports),
        quantity: Math.max(1, Number(quantity) || 1),
        estimatedWeight: calc.estimatedWeightGrams,
        estimatedPrice: calc.grandTotal,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress: customerAddress || "",
        notes: notes || "",
        status: "New",
      },
    });

    return NextResponse.json({
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.error("Failed to create print request:", error);
    return NextResponse.json(
      { error: "Failed to submit print request. Please try again." },
      { status: 500 }
    );
  }
}
