export interface MaterialItem {
  id: string;
  name: string;
  pricePerKg: number;
  density: number; // in g/cm3 (e.g. PLA: 1.24, PETG: 1.27, TPU: 1.21)
  colors: { name: string; hex: string }[];
  description?: string | null;
  nozzleTemp?: string | null;
  bedTemp?: string | null;
  tensile?: string | null;
  impact?: string | null;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type Material = MaterialItem;

export interface PricingSettingsItem {
  id: string;
  minimumCharge: number;
  machineFee: number;
  supportFee: number;
  finishingFee: number;
  packagingFee: number;
  shippingFee: number;
  rushMultiplier: number;
}

export type PricingSettings = PricingSettingsItem;

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  materials: string[];
  colors: string[];
  dimensions: string;
  printTime: string;
  sku: string;
  featured: boolean;
  active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type Product = ProductItem;

export interface PrintRequestItem {
  id: string;
  requestNumber: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  dimensionsX?: number | null;
  dimensionsY?: number | null;
  dimensionsZ?: number | null;
  volumeCm3?: number | null;
  triangleCount?: number | null;
  material: string;
  color: string;
  layerHeight: string;
  infill: number;
  supports: boolean;
  quantity: number;
  estimatedWeight: number;
  estimatedPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string | null;
  status: "New" | "Reviewing" | "Quoted" | "Confirmed" | "Printing" | "Quality Check" | "Ready" | "Completed" | "Cancelled";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type PrintRequest = PrintRequestItem;

export interface OrderItem {
  id: string;
  orderNumber: string;
  items: {
    name: string;
    sku?: string;
    material: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string | null;
  status: "Pending" | "Confirmed" | "Printing" | "Quality Check" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type Order = OrderItem;

export interface ModelGeometryAnalysis {
  dimensions: { x: number; y: number; z: number }; // in mm
  volumeCm3: number; // in cm3
  surfaceAreaCm2: number; // in cm2
  triangleCount: number;
  isWatertight: boolean;
}

export interface PriceCalculationParams {
  volumeCm3: number;
  infillPercent: number; // 10 to 100
  materialPricePerKg: number;
  materialDensity: number; // in g/cm3
  supports: boolean;
  layerHeight?: string;
  quantity: number;
  isRush?: boolean;
  settings: PricingSettingsItem;
}

export interface PriceCalculationResult {
  weightGrams?: number;
  estimatedWeightGrams: number;
  materialCost: number;
  machineFee: number;
  supportFee: number;
  finishingFee: number;
  packagingFee: number;
  shippingFee: number;
  rushFee: number;
  subtotal: number;
  totalPerUnit: number;
  grandTotal: number;
  isMinimumApplied: boolean;
  minimumApplied?: boolean;
}
