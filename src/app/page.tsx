import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";

const HeroSlicerAnimation = dynamic(
  () => import("@/components/3d/HeroSlicerAnimation"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] bg-paper-200 hairline flex items-center justify-center font-mono text-xs text-ink-muted">
        [INITIALIZING 3D ENGINE...]
      </div>
    ),
  }
);
import {
  Upload,
  ArrowUpRight,
  ArrowRight,
  Layers,
  Box,
  Cpu,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  Mail,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Palette,
} from "lucide-react";

export const revalidate = 0;

async function getHomeData() {
  try {
    const [featuredProducts, materials] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        take: 4,
        orderBy: { featured: "desc" },
      }),
      prisma.material.findMany({
        where: { active: true },
        take: 5,
        orderBy: { pricePerKg: "asc" },
      }),
    ]);

    const parsedProducts = featuredProducts.map((p) => ({
      ...p,
      images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
      materials: typeof p.materials === "string" ? JSON.parse(p.materials) : p.materials,
      colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
    }));

    const parsedMaterials = materials.map((m) => ({
      ...m,
      colors: typeof m.colors === "string" ? JSON.parse(m.colors) : m.colors,
    }));

    return {
      products: parsedProducts,
      materials: parsedMaterials,
    };
  } catch (err) {
    console.error("Failed to load home data:", err);
    return { products: [], materials: [] };
  }
}

export default async function HomePage() {
  const { products, materials } = await getHomeData();

  return (
    <div className="flex flex-col w-full bg-paper-100 text-ink">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 hairline-b overflow-hidden bg-paper-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper-200 hairline font-mono text-[11px] text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span>3D PRINTING & FABRICATION</span>
                <span>•</span>
                <span>KIKTRO LABS</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.05] tracking-tight">
                  Send us a shape. <br />
                  <span className="italic font-normal text-ink-muted">We’ll make it real.</span>
                </h1>
                <p className="text-base sm:text-lg text-ink-muted font-sans max-w-xl leading-relaxed">
                  Precision 3D printing and manufacturing for designers, engineers, and creators. Quality physical objects produced from your digital 3D designs.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 font-mono text-xs">
                <Link
                  href="/print"
                  className="flex items-center justify-center gap-3 px-6 py-3.5 bg-ink hover:bg-charcoal text-paper-100 font-medium transition-all shadow-subtle"
                >
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD 3D FILE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/models"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-200 hover:bg-paper-300 text-ink hairline transition-all"
                >
                  <span>BROWSE 3D MODELS</span>
                </Link>
              </div>

              {/* Technical Measurement Badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 hairline-t font-mono text-xs text-ink-muted">
                <div>
                  <span className="text-[10px] text-ink-subtle block uppercase">MAX PRINT SIZE</span>
                  <span className="text-ink font-semibold text-sm">325 × 320 × 325 mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-subtle block uppercase">LAYER RESOLUTION</span>
                  <span className="text-ink font-semibold text-sm">0.08 — 0.20 mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-subtle block uppercase">INPUT FORMATS</span>
                  <span className="text-ink font-semibold text-sm">.STL / .3MF / .OBJ</span>
                </div>
              </div>
            </div>

            {/* Right: Architectural 3D Study */}
            <div className="lg:col-span-5">
              <HeroSlicerAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMMEDIATE CAD TARGET STRIP */}
      <section className="bg-paper-200 hairline-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/print"
            className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-paper-100 hairline hover:border-ink transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-paper-300 group-hover:bg-terracotta group-hover:text-white flex items-center justify-center text-ink transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-ink group-hover:text-terracotta transition-colors flex items-center gap-2">
                  <span>Upload your 3D file for instant analysis</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-paper-300 text-ink-muted">
                    .STL / .3MF / .OBJ
                  </span>
                </h3>
                <p className="text-xs text-ink-muted font-sans">
                  Instant volume calculation, material weight estimation, and transparent pricing in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-ink group-hover:text-terracotta transition-colors font-medium">
              <span>OPEN 3D PRINT STUDIO</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. READY-TO-ORDER 3D MODELS (Simplified language) */}
      <section className="py-24 hairline-b bg-paper-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta block mb-2">
                READY-TO-ORDER • DIRECT WHATSAPP FULFILLMENT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink">
                Ready-to-Order 3D Models
              </h2>
              <p className="text-sm text-ink-muted font-sans mt-1">
                Browse tested 3D models. (Payment gateway under construction — direct WhatsApp ordering active).
              </p>
            </div>

            <Link
              href="/models"
              className="inline-flex items-center gap-1 font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <span>VIEW ALL 3D MODELS ({products.length > 0 ? "8+" : "ALL"})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <Link
                key={prod.id}
                href={`/models/${prod.slug || prod.id}`}
                className="group flex flex-col bg-paper-100 hairline hover:border-ink transition-all"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-paper-200 overflow-hidden">
                  {prod.images && prod.images[0] ? (
                    <Image
                      src={prod.images[0]}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink-subtle">
                      [3D MODEL]
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-paper-100/90 text-[10px] font-mono text-ink hairline">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-sm text-ink group-hover:text-terracotta transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-ink-muted font-sans line-clamp-2 mt-1 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 hairline-t flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-ink-subtle block">PRICE</span>
                      <span className="text-ink font-bold text-sm">₹{prod.price}</span>
                    </div>

                    <span className="text-ink-muted text-[11px]">{prod.printTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEDICATED MULTICOLOUR PRINTING SECTION */}
      <section className="py-20 bg-paper-200 hairline-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-paper-100 hairline shadow-subtle space-y-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper-200 hairline font-mono text-[11px] text-ink">
                <Palette className="w-3.5 h-3.5 text-terracotta" />
                <span>MULTIPLE-COLOUR CAPABILITY</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-ink">
                Multicolour 3D Printing
              </h2>

              <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
                Dimension can handle multiple-colour 3D printing for your models, logos, signage, and multi-tone functional prototypes. Seamlessly blend multiple filament colors in a single solid print.
              </p>
            </div>

            <div className="pt-2 hairline-t">
              <div className="font-mono text-xs text-ink font-semibold mb-4">
                Need a multi-colour print? Contact us →
              </div>

              {/* 4 Contact Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                {/* Email */}
                <a
                  href="mailto:real.kiktro@gmail.com?subject=Multicolour%203D%20Printing%20Inquiry"
                  className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-8 h-8 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-ink">Email Us</span>
                  <span className="text-[10px] text-ink-muted font-sans truncate max-w-full">real.kiktro@gmail.com</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'm%20interested%20in%20a%20multicolour%203D%20print."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-8 h-8 bg-paper-300 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-ink transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-ink">WhatsApp</span>
                  <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
                </a>

                {/* SMS */}
                <a
                  href="sms:+918336800598?body=Hi%20Dimension,%20I'm%20inquiring%20about%20multicolour%203D%20printing."
                  className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-8 h-8 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-ink">SMS</span>
                  <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
                </a>

                {/* Call */}
                <a
                  href="tel:+918336800598"
                  className="p-4 bg-paper-200 hairline hover:border-ink transition-all flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-8 h-8 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-ink">Call</span>
                  <span className="text-[10px] text-ink-muted font-sans">+91 83368 00598</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MATERIAL SCIENCE MATRIX */}
      <section className="py-24 bg-paper-100 hairline-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta block mb-2">
                MATERIALS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink">
                Supported Materials
              </h2>
            </div>
            <p className="font-mono text-xs text-ink-muted">
              CALIBRATED DENSITIES & LIVE ₹/KG RATES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="p-6 bg-paper-200 hairline flex flex-col justify-between space-y-4 shadow-subtle"
              >
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display font-bold text-base text-ink">
                      {mat.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-ink">
                      ₹{mat.pricePerKg}/kg
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted font-sans leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 hairline-t space-y-2 font-mono text-xs text-ink-muted">
                  <div className="flex justify-between">
                    <span>Density</span>
                    <span className="text-ink font-medium">{mat.density} g/cm³</span>
                  </div>
                  {mat.tensile && (
                    <div className="flex justify-between">
                      <span>Tensile Rating</span>
                      <span className="text-ink font-medium">{mat.tensile}</span>
                    </div>
                  )}

                  {/* Swatches */}
                  <div className="pt-2">
                    <span className="text-[10px] text-ink-subtle block mb-1">AVAILABLE COLORS</span>
                    <div className="flex flex-wrap gap-1.5">
                      {mat.colors && mat.colors.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          title={c.name}
                          className="w-3.5 h-3.5 rounded-full border border-paper-400"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MANUFACTURING CAPABILITIES */}
      <section className="py-24 bg-paper-200 hairline-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta block">
                CAPABILITIES
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight">
                Digital designs. <br />
                <span className="italic text-ink-muted">Physical objects.</span>
              </h2>

              <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
                Dimension provides on-demand 3D printing for rapid prototyping, production parts, architectural models, and custom mechanical components. Every part is verified for geometric watertightness and measured for accuracy before dispatch.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-4 bg-paper-100 hairline space-y-1">
                  <span className="text-ink font-bold block">MAX BUILD SIZE</span>
                  <p className="text-xs text-ink-muted font-sans">325 × 320 × 325 mm single volume.</p>
                </div>
                <div className="p-4 bg-paper-100 hairline space-y-1">
                  <span className="text-ink font-bold block">ACCURACY</span>
                  <p className="text-xs text-ink-muted font-sans">±0.1 mm repeatable calibration.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 bg-paper-100 hairline space-y-6">
                <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold border-b border-paper-400 pb-3">
                  HOW IT WORKS
                </h3>

                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-ink text-paper-100 flex items-center justify-center text-[10px] flex-shrink-0">
                      01
                    </span>
                    <div>
                      <strong className="text-ink block font-sans text-sm font-semibold">Upload 3D File</strong>
                      <span className="text-ink-muted font-sans">Drop your .STL, .3MF, or .OBJ file for instant volumetric calculation.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-ink text-paper-100 flex items-center justify-center text-[10px] flex-shrink-0">
                      02
                    </span>
                    <div>
                      <strong className="text-ink block font-sans text-sm font-semibold">Configure Material & Resolution</strong>
                      <span className="text-ink-muted font-sans">Choose material polymer, color, infill density, and layer resolution.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-ink text-paper-100 flex items-center justify-center text-[10px] flex-shrink-0">
                      03
                    </span>
                    <div>
                      <strong className="text-ink block font-sans text-sm font-semibold">3D Printing & Quality Check</strong>
                      <span className="text-ink-muted font-sans">Precision manufacturing, post-finishing, and tracked courier delivery.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 bg-paper-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
            Ready to print your design?
          </h2>
          <p className="text-ink-muted font-sans text-base max-w-md mx-auto">
            Upload your 3D CAD file to get an instant volume analysis and transparent price breakdown in seconds.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              href="/print"
              className="px-8 py-3.5 bg-ink hover:bg-charcoal text-paper-100 font-medium transition-all"
            >
              LAUNCH 3D PRINT STUDIO →
            </Link>
            <Link
              href="/models"
              className="px-8 py-3.5 bg-paper-200 hover:bg-paper-300 text-ink hairline transition-all"
            >
              BROWSE 3D MODELS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
