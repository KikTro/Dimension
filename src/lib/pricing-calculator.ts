import { Material, PricingSettings, ModelGeometryAnalysis, PriceCalculationParams, PriceCalculationResult } from "./types";

/**
 * Calculates the exact transparent price for a 3D print request based on:
 * - Model volume (cm3)
 * - Infill percentage (10% - 100%)
 * - Material density (g/cm3) & price per kg
 * - Dynamic admin pricing settings (minimum charge, machine fee, support fee, packaging, shipping, rush fee)
 */
export function calculatePrintPrice(params: PriceCalculationParams): PriceCalculationResult {
  const {
    volumeCm3,
    infillPercent,
    materialPricePerKg,
    materialDensity,
    supports,
    quantity,
    isRush = false,
    settings,
  } = params;

  // 1. Effective volume factoring shell walls (approx 20-25% solid) + infill interior
  const infillRatio = Math.max(0.1, Math.min(1.0, infillPercent / 100));
  const shellFraction = 0.22; // Outer perimeter walls, top and bottom solid layers
  const internalFraction = 0.78;
  const effectiveVolumeFraction = shellFraction + internalFraction * infillRatio;

  let effectiveVolumeCm3 = volumeCm3 * effectiveVolumeFraction;

  // Additional support material volume if required
  if (supports) {
    effectiveVolumeCm3 *= 1.15; // ~15% extra material for tree/normal supports
  }

  // Weight in grams = Volume (cm3) * Density (g/cm3)
  const estimatedWeightGrams = Number((effectiveVolumeCm3 * (materialDensity || 1.24)).toFixed(1));
  const weightKg = estimatedWeightGrams / 1000.0;

  // 2. Costs
  const materialCost = Number((weightKg * materialPricePerKg).toFixed(2));
  const machineFee = Number((settings?.machineFee || 0).toFixed(2));
  const supportFee = supports ? Number((settings?.supportFee || 0).toFixed(2)) : 0;
  const finishingFee = Number((settings?.finishingFee || 0).toFixed(2));
  const packagingFee = Number((settings?.packagingFee || 0).toFixed(2));
  const shippingFee = Number((settings?.shippingFee || 0).toFixed(2));

  // Unit subtotal
  let unitRawTotal = materialCost + machineFee + supportFee + finishingFee;
  let isMinimumApplied = false;

  const minCharge = settings?.minimumCharge || 150;
  if (unitRawTotal < minCharge) {
    unitRawTotal = minCharge;
    isMinimumApplied = true;
  }

  const totalPerUnit = Number(unitRawTotal.toFixed(2));
  const subtotal = Number((totalPerUnit * Math.max(1, quantity)).toFixed(2));

  const rushMultiplier = settings?.rushMultiplier || 1.0;
  const rushFee = isRush
    ? Number((subtotal * (Math.max(1.0, rushMultiplier) - 1.0)).toFixed(2))
    : 0;

  const grandTotal = Number((subtotal + rushFee + packagingFee + shippingFee).toFixed(2));

  return {
    weightGrams: estimatedWeightGrams,
    estimatedWeightGrams,
    materialCost,
    machineFee,
    supportFee,
    finishingFee,
    packagingFee,
    shippingFee,
    rushFee,
    subtotal,
    totalPerUnit,
    grandTotal,
    isMinimumApplied,
    minimumApplied: isMinimumApplied,
  };
}

export interface FriendlyPriceParams {
  geometry: ModelGeometryAnalysis;
  material: Material;
  settings: PricingSettings;
  layerHeight?: string;
  infillPercent: number;
  requiresSupports: boolean;
  quantity: number;
  isRush?: boolean;
}

export function calculatePrice(params: FriendlyPriceParams): PriceCalculationResult {
  return calculatePrintPrice({
    volumeCm3: params.geometry.volumeCm3 || 45,
    infillPercent: params.infillPercent,
    materialPricePerKg: params.material.pricePerKg,
    materialDensity: params.material.density,
    supports: params.requiresSupports,
    quantity: params.quantity,
    isRush: params.isRush,
    settings: params.settings,
  });
}
