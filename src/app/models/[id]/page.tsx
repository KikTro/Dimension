import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/models/ProductDetailClient";

export const revalidate = 0;

async function getProduct(slugOrId: string) {
  try {
    let product = await prisma.product.findUnique({
      where: { slug: slugOrId },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { id: slugOrId },
      });
    }

    if (!product) return null;

    return {
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images,
      materials: typeof product.materials === "string" ? JSON.parse(product.materials) : product.materials,
      colors: typeof product.colors === "string" ? JSON.parse(product.colors) : product.colors,
    };
  } catch (err) {
    console.error("Failed to load product:", err);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 bg-paper-100 min-h-screen text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
