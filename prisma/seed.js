const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding revised Dimension database (Brand-centric, no hardware names)...");

  // 1. Seed Pricing Settings
  await prisma.pricingSettings.upsert({
    where: { id: "default" },
    update: {
      minimumCharge: 150.0,
      machineFee: 45.0,
      supportFee: 25.0,
      finishingFee: 20.0,
      packagingFee: 30.0,
      shippingFee: 70.0,
      rushMultiplier: 1.35,
    },
    create: {
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
  console.log("✓ Pricing settings seeded");

  // 2. Seed Materials with high-precision engineering descriptions
  const materials = [
    {
      name: "PLA Matte (Architectural Grade)",
      pricePerKg: 850.0,
      density: 1.24,
      colors: JSON.stringify([
        { name: "Graphite Charcoal", hex: "#1D2024" },
        { name: "Paper Off-White", hex: "#F3F2EE" },
        { name: "Terracotta Umber", hex: "#B85834" },
        { name: "Limestone Stone", hex: "#C5C0B4" },
        { name: "Prussian Slate", hex: "#223140" },
        { name: "Olive Graphite", hex: "#4A5243" },
      ]),
      description: "Non-reflective ultra-fine surface texture with high dimensional accuracy. Ideal for industrial design models, architectural miniatures, and tactile enclosures.",
      nozzleTemp: "210-225°C",
      bedTemp: "50-60°C",
      tensile: "55 MPa",
      impact: "Moderate",
      active: true,
    },
    {
      name: "PETG Functional (High Toughness)",
      pricePerKg: 980.0,
      density: 1.27,
      colors: JSON.stringify([
        { name: "Onyx Black", hex: "#111214" },
        { name: "Pure White", hex: "#FFFFFF" },
        { name: "Optical Clear", hex: "#E8EDF2" },
        { name: "Deep Navy", hex: "#142436" },
        { name: "Crimson Umber", hex: "#8A2A28" },
      ]),
      description: "Chemical and water-resistant thermoplastic copolymer with exceptional impact resistance and layer bonding. Designed for mechanical brackets, robotics fixtures, and functional end-use parts.",
      nozzleTemp: "235-250°C",
      bedTemp: "70-80°C",
      tensile: "50 MPa",
      impact: "High",
      active: true,
    },
    {
      name: "TPU 95A (Elastomeric Polymer)",
      pricePerKg: 1450.0,
      density: 1.21,
      colors: JSON.stringify([
        { name: "Matte Black", hex: "#1A1A1A" },
        { name: "Chalk White", hex: "#FAF8F5" },
        { name: "Terracotta", hex: "#B85834" },
        { name: "Slate Blue", hex: "#2E3D4F" },
      ]),
      description: "Semi-flexible thermoplastic polyurethane engineered for vibration isolation, non-marring feet, gaskets, and impact dampening.",
      nozzleTemp: "220-235°C",
      bedTemp: "40-50°C",
      tensile: "35 MPa",
      impact: "Ultra High",
      active: true,
    },
    {
      name: "ABS / ASA (UV & Thermal Engineering)",
      pricePerKg: 1150.0,
      density: 1.07,
      colors: JSON.stringify([
        { name: "Industrial Charcoal", hex: "#202328" },
        { name: "Warm Alabaster", hex: "#ECEAE4" },
        { name: "Deep Oxide", hex: "#632720" },
      ]),
      description: "High glass-transition temperature polymer (rated to 100°C) with superior dimensional stability and UV weather resistance for automotive and outdoor applications.",
      nozzleTemp: "250-265°C",
      bedTemp: "90-105°C",
      tensile: "45 MPa",
      impact: "Very High",
      active: true,
    },
    {
      name: "Carbon Fiber Reinforced PLA",
      pricePerKg: 1800.0,
      density: 1.30,
      colors: JSON.stringify([
        { name: "Forged Matte Charcoal", hex: "#181A1D" },
        { name: "Raw Titanium Graphite", hex: "#2F3339" },
      ]),
      description: "Structural composite polymer matrix infused with micro carbon fibers. Offers extreme structural stiffness, minimal warpage, and a tactile matte industrial sheen.",
      nozzleTemp: "220-240°C",
      bedTemp: "55-65°C",
      tensile: "68 MPa",
      impact: "High Rigidity",
      active: true,
    },
  ];

  for (const mat of materials) {
    await prisma.material.upsert({
      where: { name: mat.name },
      update: mat,
      create: mat,
    });
  }
  console.log("✓ Materials seeded");

  // 3. Seed Ready-To-Print Physical Design Products
  const products = [
    {
      name: "Apex Monolith Device Stand",
      slug: "apex-monolith-device-stand",
      description: "An architectural, weighted desktop easel engineered for tablets, notebooks, and mobile workstations. Features an asymmetric 62-degree ergonomic incline, integrated silicone foot channels, and concealed cable passages.",
      price: 490.0,
      category: "Desk & Studio",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1586775490184-b79f0621891f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "PETG Functional (High Toughness)", "Carbon Fiber Reinforced PLA"]),
      colors: JSON.stringify(["Graphite Charcoal", "Paper Off-White", "Terracotta Umber", "Forged Matte Charcoal"]),
      dimensions: "118 × 82 × 92 mm",
      printTime: "2h 40m",
      sku: "DIM-DSK-001",
      featured: true,
      active: true,
    },
    {
      name: "Strata Modular Cable Spine",
      slug: "strata-modular-cable-spine",
      description: "Tactile, monolithic desktop cable organizer with weighted interlocking chambers. Designed to hold heavy braided cables, Thunderbolt connectors, and USB-C lines without desk clutter.",
      price: 280.0,
      category: "Desk & Studio",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "PETG Functional (High Toughness)"]),
      colors: JSON.stringify(["Graphite Charcoal", "Paper Off-White", "Terracotta Umber"]),
      dimensions: "94 × 42 × 30 mm",
      printTime: "1h 15m",
      sku: "DIM-DSK-002",
      featured: true,
      active: true,
    },
    {
      name: "IsoGrid FPV Motor Guards (Set of 4)",
      slug: "isogrid-fpv-motor-guards",
      description: "Impact-dispersing 95A elastomeric bumper caps engineered for high-velocity aerodynamic frames. Absorbs kinetic crash energy while providing uncompromised motor bell ventilation.",
      price: 380.0,
      category: "Mechanical & Robotics",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["TPU 95A (Elastomeric Polymer)"]),
      colors: JSON.stringify(["Terracotta", "Matte Black", "Slate Blue"]),
      dimensions: "44 × 32 × 18 mm each",
      printTime: "1h 45m",
      sku: "DIM-MCH-001",
      featured: false,
      active: true,
    },
    {
      name: "Tectonic Geodesic Planter",
      slug: "tectonic-geodesic-planter",
      description: "Mathematically sculpted isometric vessel with an internal sub-irrigation reservoir and concealed water overflow basin. Clean multifaceted geometry with watertight interior walls.",
      price: 640.0,
      category: "Architectural Objects",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "PETG Functional (High Toughness)", "Carbon Fiber Reinforced PLA"]),
      colors: JSON.stringify(["Paper Off-White", "Graphite Charcoal", "Limestone Stone", "Olive Graphite"]),
      dimensions: "128 × 128 × 110 mm",
      printTime: "4h 15m",
      sku: "DIM-ARC-001",
      featured: true,
      active: true,
    },
    {
      name: "Vernier Benchtop Caliper Holster",
      slug: "vernier-benchtop-caliper-holster",
      description: "Precision workshop fixture for 150mm digital micrometers and calipers. Engineered with a zero-slop friction retention angle and chamfered finger-release pocket.",
      price: 320.0,
      category: "Mechanical & Robotics",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "Carbon Fiber Reinforced PLA"]),
      colors: JSON.stringify(["Graphite Charcoal", "Terracotta Umber", "Forged Matte Charcoal"]),
      dimensions: "168 × 48 × 32 mm",
      printTime: "1h 50m",
      sku: "DIM-MCH-002",
      featured: false,
      active: true,
    },
    {
      name: "Compliant Micro-Detent Mechanism",
      slug: "compliant-micro-detent-mechanism",
      description: "Print-in-place monolithic mechanical artifact with continuous flexure hinges and rhythmic tactile haptic feedback. Manufactured with tight 0.12mm kinematic clearances.",
      price: 420.0,
      category: "Mechanical & Robotics",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "Carbon Fiber Reinforced PLA"]),
      colors: JSON.stringify(["Graphite Charcoal", "Terracotta Umber", "Prussian Slate"]),
      dimensions: "52 × 52 × 52 mm",
      printTime: "2h 20m",
      sku: "DIM-MCH-003",
      featured: true,
      active: true,
    },
    {
      name: "Enclosure Matrix for Single-Board Computers",
      slug: "enclosure-matrix-sbc",
      description: "Industrial chassis with passive chimney thermal convection channels, DIN rail interlocking lugs, and recessed M2.5 threaded insert mounting bosses.",
      price: 740.0,
      category: "Mechanical & Robotics",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PETG Functional (High Toughness)", "ABS / ASA (UV & Thermal Engineering)", "Carbon Fiber Reinforced PLA"]),
      colors: JSON.stringify(["Industrial Charcoal", "Forged Matte Charcoal"]),
      dimensions: "108 × 78 × 44 mm",
      printTime: "3h 30m",
      sku: "DIM-MCH-004",
      featured: false,
      active: true,
    },
    {
      name: "HexWall Monolith Fastener Bin",
      slug: "hexwall-monolith-fastener-bin",
      description: "Modular interlocking hardware organizer for electronic components and laboratory fasteners. Slides effortlessly into Dimension workshop wall matrices.",
      price: 220.0,
      category: "Desk & Studio",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=1200&auto=format&fit=crop"
      ]),
      materials: JSON.stringify(["PLA Matte (Architectural Grade)", "PETG Functional (High Toughness)"]),
      colors: JSON.stringify(["Graphite Charcoal", "Paper Off-White", "Terracotta Umber"]),
      dimensions: "98 × 86 × 62 mm",
      printTime: "1h 30m",
      sku: "DIM-DSK-003",
      featured: false,
      active: true,
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: prod,
      create: prod,
    });
  }
  console.log("✓ Ready-to-print products seeded");

  // 4. Seed Sample Print Requests
  const sampleRequests = [
    {
      requestNumber: "REQ-2026-0412",
      fileName: "gimbal_arm_bracket_v4.stl",
      fileUrl: "/uploads/samples/precision_mount.stl",
      fileSize: 4194304,
      dimensionsX: 84.5,
      dimensionsY: 62.0,
      dimensionsZ: 45.2,
      volumeCm3: 38.6,
      triangleCount: 42800,
      material: "Carbon Fiber Reinforced PLA",
      color: "Forged Matte Charcoal",
      layerHeight: "0.12mm (Fine)",
      infill: 40,
      supports: true,
      quantity: 2,
      estimatedWeight: 52.4,
      estimatedPrice: 460.0,
      customerName: "Arjun Verma",
      customerEmail: "arjun.v@aerotech-labs.in",
      customerPhone: "+91 98765 43210",
      customerAddress: "Studio 402, Outer Ring Road, Bengaluru 560103",
      notes: "High stiffness required for vibration dampening.",
      status: "Printing",
    },
    {
      requestNumber: "REQ-2026-0413",
      fileName: "trackball_ergonomic_shell.stl",
      fileUrl: "/uploads/samples/precision_mount.stl",
      fileSize: 6815744,
      dimensionsX: 135.0,
      dimensionsY: 98.4,
      dimensionsZ: 58.6,
      volumeCm3: 72.1,
      triangleCount: 89400,
      material: "PETG Functional (High Toughness)",
      color: "Onyx Black",
      layerHeight: "0.16mm (Optimal)",
      infill: 25,
      supports: true,
      quantity: 1,
      estimatedWeight: 94.2,
      estimatedPrice: 340.0,
      customerName: "Pooja Sundaram",
      customerEmail: "pooja.design@studio.xyz",
      customerPhone: "+91 98123 45678",
      customerAddress: "Flat 12B, Skyline Towers, Indiranagar, Bengaluru 560038",
      notes: "Matte surface finish preferred.",
      status: "Reviewing",
    }
  ];

  for (const req of sampleRequests) {
    await prisma.printRequest.upsert({
      where: { requestNumber: req.requestNumber },
      update: req,
      create: req,
    });
  }
  console.log("✓ Sample print requests seeded");

  // 5. Seed Sample Orders
  const sampleOrders = [
    {
      orderNumber: "ORD-2026-8801",
      items: JSON.stringify([
        {
          name: "Apex Monolith Device Stand",
          sku: "DIM-DSK-001",
          material: "Carbon Fiber Reinforced PLA",
          color: "Forged Matte Charcoal",
          quantity: 1,
          unitPrice: 570.0,
        },
        {
          name: "Strata Modular Cable Spine",
          sku: "DIM-DSK-002",
          material: "PLA Matte (Architectural Grade)",
          color: "Terracotta Umber",
          quantity: 2,
          unitPrice: 280.0,
        }
      ]),
      totalAmount: 1230.0,
      customerName: "Karthik R.",
      customerEmail: "karthik.r@kiktro.com",
      customerPhone: "+91 83368 00598",
      customerAddress: "44, Talbagan, Noapara, Baranagar, Kolkata 700090, West Bengal, India",
      notes: "Internal studio evaluation.",
      status: "Printing",
    }
  ];

  for (const ord of sampleOrders) {
    await prisma.order.upsert({
      where: { orderNumber: ord.orderNumber },
      update: ord,
      create: ord,
    });
  }
  console.log("✓ Sample orders seeded");

  console.log("Database seeded with clean Dimension identity!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
