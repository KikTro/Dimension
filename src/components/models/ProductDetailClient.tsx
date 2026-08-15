"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Product } from "@/lib/types";

const ThreeViewer = dynamic(() => import("@/components/3d/ThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#EBEAE5] hairline flex items-center justify-center font-mono text-xs text-ink-muted">
      [INITIALIZING 3D VIEWPORT...]
    </div>
  ),
});
import {
  ArrowLeft,
  CheckCircle2,
  Box,
  Layers,
  Clock,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  X,
  MessageCircle,
  ArrowUpRight,
  Mail,
  PhoneCall,
  Hammer,
  AlertCircle,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = Array.isArray(product.images) ? product.images : [];
  const materials = Array.isArray(product.materials) ? product.materials : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || "PLA Matte (Architectural Grade)");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Graphite Charcoal");
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState("");

  // Price adjustment for premium materials
  const isPremiumMaterial =
    selectedMaterial.includes("Carbon Fiber") || selectedMaterial.includes("TPU");
  const unitPrice = isPremiumMaterial ? Math.round(product.price * 1.25) : product.price;
  const totalPrice = unitPrice * quantity;

  // WhatsApp direct link generator
  const getWhatsAppOrderUrl = () => {
    const lines = [
      `*3D Model Order Request — Dimension Studio*`,
      ``,
      `*Product:* ${product.name}`,
      `*SKU:* ${product.sku}`,
      `*Material Grade:* ${selectedMaterial}`,
      `*Color Finish:* ${selectedColor}`,
      `*Quantity:* ${quantity} unit(s)`,
      `*Unit Price:* ₹${unitPrice}`,
      `*Total Estimate:* ₹${totalPrice}`,
      `*Dimensions:* ${product.dimensions}`,
    ];

    if (specialNotes.trim()) {
      lines.push(`*Special Request:* ${specialNotes.trim()}`);
    }

    lines.push(``);
    lines.push(`Hi Dimension team, I would like to order and 3D print this model. Please let me know the dispatch timeframe and payment details.`);

    return `https://wa.me/918336800598?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumb */}
      <div className="font-mono text-xs text-ink-muted flex items-center gap-2">
        <Link href="/models" className="hover:text-ink flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>3D MODELS</span>
        </Link>
        <span>/</span>
        <span className="text-ink font-semibold">{product.name}</span>
      </div>

      {/* Main Product Monograph Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT 7 COLS: Gallery / 3D Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/3] bg-paper-200 hairline overflow-hidden">
            {show3DViewer ? (
              <ThreeViewer height="h-full" />
            ) : images[selectedImageIndex] ? (
              <Image
                src={images[selectedImageIndex]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink-muted">
                [NO IMAGE]
              </div>
            )}

            {/* 3D / Photo View Toggle */}
            <div className="absolute bottom-4 right-4 z-10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShow3DViewer(!show3DViewer)}
                className="px-3.5 py-1.5 bg-ink text-paper-100 font-medium flex items-center gap-1.5 shadow-subtle hover:bg-charcoal transition-colors"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{show3DViewer ? "SHOW PHOTOGRAPHY" : "INTERACTIVE 3D CAD"}</span>
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {!show3DViewer && images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-16 bg-paper-200 hairline flex-shrink-0 transition-all ${
                    selectedImageIndex === idx ? "border-ink" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: Product Details & Order Customizer */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
              <span>SKU: {product.sku}</span>
              <span className="text-terracotta">{product.category}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-serif text-3xl text-ink font-bold">
                ₹{unitPrice}
              </span>
              {isPremiumMaterial && (
                <span className="font-mono text-[11px] text-terracotta">
                  (Includes composite polymer surcharge)
                </span>
              )}
            </div>

            <p className="text-sm text-ink-muted font-sans leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Customizer */}
          <div className="space-y-6 pt-6 hairline-t font-mono text-xs">
            {/* Material */}
            <div className="space-y-2">
              <label className="text-ink font-semibold block">Material Grade:</label>
              <div className="space-y-1.5">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className={`w-full p-2.5 text-left hairline flex items-center justify-between transition-colors ${
                      selectedMaterial === mat
                        ? "bg-paper-300 border-ink text-ink font-semibold"
                        : "bg-paper-100 text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span>{mat}</span>
                    {selectedMaterial === mat && <CheckCircle2 className="w-3.5 h-3.5 text-ink" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-ink font-semibold block">Color Finish ({selectedColor}):</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 hairline transition-colors ${
                      selectedColor === col
                        ? "bg-ink text-paper-100 font-semibold"
                        : "bg-paper-200 text-ink-muted hover:text-ink"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-ink font-semibold">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-paper-200 hairline flex items-center justify-center font-bold text-ink"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-paper-200 hairline flex items-center justify-center font-bold text-ink"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Requests Note */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-ink font-semibold block text-[11px] uppercase tracking-wide">
                Special Requests / Custom Notes (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Specific scale, color combo, threaded inserts, rush..."
                className="w-full px-3 py-2 bg-paper-200 hairline text-xs text-ink placeholder-ink-subtle focus:outline-none focus:border-ink font-sans"
              />
            </div>

            {/* Payment Gateway Under Construction Notice */}
            <div className="p-4 bg-amber-500/10 hairline border-amber-600/30 space-y-1.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <Hammer className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                <span className="uppercase text-[11px] tracking-wide">Payment Gateway Under Construction</span>
              </div>
              <p className="text-[11px] text-amber-950/80 font-sans leading-relaxed">
                Direct online checkout is currently under maintenance. Connect with us directly to print and order your 3D model over WhatsApp.
              </p>
            </div>

            {/* Direct WhatsApp Order Action */}
            <div className="space-y-2.5">
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-subtle"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>ORDER & PRINT VIA WHATSAPP — ₹{totalPrice}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
                <a
                  href="tel:+918336800598"
                  className="py-2.5 px-3 bg-paper-200 hairline hover:border-ink transition-colors flex items-center justify-center gap-1.5 text-ink"
                >
                  <PhoneCall className="w-3 h-3 text-terracotta" />
                  <span>Call (+91 83368 00598)</span>
                </a>
                <a
                  href={`mailto:real.kiktro@gmail.com?subject=${encodeURIComponent(`Order Request: ${product.name}`)}`}
                  className="py-2.5 px-3 bg-paper-200 hairline hover:border-ink transition-colors flex items-center justify-center gap-1.5 text-ink"
                >
                  <Mail className="w-3 h-3 text-terracotta" />
                  <span>Email Studio</span>
                </a>
              </div>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="p-5 bg-paper-200 hairline space-y-3 font-mono text-xs">
            <span className="text-ink font-semibold uppercase text-[11px] block hairline-b pb-2">
              TECHNICAL SPECIFICATIONS
            </span>
            <div className="space-y-1.5 text-ink-muted text-[11px]">
              <div className="flex justify-between">
                <span>Dimensions:</span>
                <span className="text-ink font-medium">{product.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span>Production Run Time:</span>
                <span className="text-ink font-medium">{product.printTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Dimensional Calibration:</span>
                <span className="text-ink font-medium">±0.1 mm repeatable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
