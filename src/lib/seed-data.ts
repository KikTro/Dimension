/**
 * Static seed data for the Dimension platform.
 * Used as fallback when the database is unavailable (e.g., Vercel serverless).
 */

export const SEED_PRICING_SETTINGS = {
  id: "default",
  minimumCharge: 150.0,
  machineFee: 45.0,
  supportFee: 25.0,
  finishingFee: 20.0,
  packagingFee: 30.0,
  shippingFee: 70.0,
  rushMultiplier: 1.35,
  updatedAt: new Date().toISOString(),
};

export const SEED_MATERIALS = [
  {
    id: "mat-pla",
    name: "PLA Matte (Architectural Grade)",
    pricePerKg: 850.0,
    density: 1.24,
    colors: [
      { name: "Graphite Charcoal", hex: "#1D2024" },
      { name: "Paper Off-White", hex: "#F3F2EE" },
      { name: "Terracotta Umber", hex: "#B85834" },
      { name: "Limestone Stone", hex: "#C5C0B4" },
      { name: "Prussian Slate", hex: "#223140" },
      { name: "Olive Graphite", hex: "#4A5243" },
    ],
    description:
      "Non-reflective ultra-fine surface texture with high dimensional accuracy. Ideal for industrial design models, architectural miniatures, and tactile enclosures.",
    nozzleTemp: "210-225°C",
    bedTemp: "50-60°C",
    tensile: "55 MPa",
    impact: "Moderate",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat-petg",
    name: "PETG Functional (High Toughness)",
    pricePerKg: 980.0,
    density: 1.27,
    colors: [
      { name: "Onyx Black", hex: "#111214" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Optical Clear", hex: "#E8EDF2" },
      { name: "Deep Navy", hex: "#142436" },
      { name: "Crimson Umber", hex: "#8A2A28" },
    ],
    description:
      "Chemical and water-resistant thermoplastic copolymer with exceptional impact resistance and layer bonding. Designed for mechanical brackets, robotics fixtures, and functional end-use parts.",
    nozzleTemp: "235-250°C",
    bedTemp: "70-80°C",
    tensile: "50 MPa",
    impact: "High",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat-tpu",
    name: "TPU 95A (Elastomeric Polymer)",
    pricePerKg: 1450.0,
    density: 1.21,
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Chalk White", hex: "#FAF8F5" },
      { name: "Terracotta", hex: "#B85834" },
      { name: "Slate Blue", hex: "#2E3D4F" },
    ],
    description:
      "Semi-flexible thermoplastic polyurethane engineered for vibration isolation, non-marring feet, gaskets, and impact dampening.",
    nozzleTemp: "220-235°C",
    bedTemp: "40-50°C",
    tensile: "35 MPa",
    impact: "Ultra High",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat-abs",
    name: "ABS / ASA (UV & Thermal Engineering)",
    pricePerKg: 1150.0,
    density: 1.07,
    colors: [
      { name: "Industrial Charcoal", hex: "#202328" },
      { name: "Warm Alabaster", hex: "#ECEAE4" },
      { name: "Deep Oxide", hex: "#632720" },
    ],
    description:
      "High glass-transition temperature polymer (rated to 100°C) with superior dimensional stability and UV weather resistance for automotive and outdoor applications.",
    nozzleTemp: "250-265°C",
    bedTemp: "90-105°C",
    tensile: "45 MPa",
    impact: "Very High",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat-cf",
    name: "Carbon Fiber Reinforced PLA",
    pricePerKg: 1800.0,
    density: 1.30,
    colors: [
      { name: "Forged Matte Charcoal", hex: "#181A1D" },
      { name: "Raw Titanium Graphite", hex: "#2F3339" },
    ],
    description:
      "Structural composite polymer matrix infused with micro carbon fibers. Offers extreme structural stiffness, minimal warpage, and a tactile matte industrial sheen.",
    nozzleTemp: "220-240°C",
    bedTemp: "55-65°C",
    tensile: "68 MPa",
    impact: "High Rigidity",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SEED_PRODUCTS = [
  {
    id: "prod-001",
    name: "Nothing",
    slug: "nothing",
    description:
      "There is nothing here :)",
    price: 0.0,
    category: "Placeholder",
    images: [
      "",
      "",
    ],
    materials: [
      "",
    ],
    colors: ["NONE", "NOTHING"],
    dimensions: "0 × 0 × 0 mm",
    printTime: "0h 0m",
    sku: "DIM-ARC-001",
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
