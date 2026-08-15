import React from "react";
import { prisma } from "@/lib/prisma";
import ModelsClientGrid from "@/components/models/ModelsClientGrid";

export const revalidate = 0;

async function getCatalogData() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    const parsed = products.map((p) => ({
      ...p,
      images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
      materials: typeof p.materials === "string" ? JSON.parse(p.materials) : p.materials,
      colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
    }));

    const categories = Array.from(new Set(parsed.map((p) => p.category))).filter(Boolean);

    return { products: parsed, categories };
  } catch (err) {
    console.error("Failed to load models catalog:", err);
    return { products: [], categories: [] };
  }
}

export default async function ModelsPage() {
  const { products, categories } = await getCatalogData();

  return (
    <div className="pt-28 pb-20 bg-paper-100 min-h-screen text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-paper-400 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta block">
              3D MODEL STORE
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink">
              Ready-to-Order 3D Models
            </h1>
            <p className="text-sm text-ink-muted font-sans max-w-lg leading-relaxed">
              Browse tested, functional 3D models ready for immediate 3D printing and delivery.
            </p>
          </div>

          <div className="font-mono text-xs text-ink-muted">
            AVAILABLE: <span className="text-ink font-bold">{products.length} MODELS</span>
          </div>
        </div>

        {/* Client Grid with Custom Model Request Banner */}
        <ModelsClientGrid initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
