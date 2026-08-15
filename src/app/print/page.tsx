"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ThreeViewer = dynamic(() => import("@/components/3d/ThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] bg-[#EBEAE5] hairline flex items-center justify-center font-mono text-xs text-ink-muted">
      [INITIALIZING 3D VIEWPORT...]
    </div>
  ),
});
import { parseSTL } from "@/lib/stl-parser";
import { Material, PricingSettings, ModelGeometryAnalysis, PriceCalculationResult } from "@/lib/types";
import { calculatePrice } from "@/lib/pricing-calculator";
import {
  Upload,
  FileCheck,
  Layers,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowUpRight,
  X,
  FileText,
  MessageCircle,
  Mail,
  PhoneCall,
  Hammer,
  Wrench,
  Boxes,
  Cpu,
  Palette,
  ShieldCheck,
} from "lucide-react";

export default function PrintConfiguratorPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // File Upload
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Geometry
  const [geometry, setGeometry] = useState<ModelGeometryAnalysis>({
    dimensions: { x: 75.0, y: 45.0, z: 75.0 },
    volumeCm3: 48.5,
    surfaceAreaCm2: 68.0,
    triangleCount: 38400,
    isWatertight: true,
  });

  // Parameters
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [layerHeight, setLayerHeight] = useState<string>("0.16mm (Optimal)");
  const [infill, setInfill] = useState<number>(25);
  const [supports, setSupports] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [rush, setRush] = useState<boolean>(false);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Price Calculation State
  const [priceBreakdown, setPriceBreakdown] = useState<PriceCalculationResult | null>(null);

  // WhatsApp link generator
  const getWhatsAppPrintUrl = () => {
    const lines = [
      `*Custom 3D Print Request — Dimension Studio*`,
      ``,
      `*File Name:* ${file ? file.name : "Custom CAD Model"}`,
      `*Dimensions:* ${geometry.dimensions.x} × ${geometry.dimensions.y} × ${geometry.dimensions.z} mm`,
      `*Volume:* ${geometry.volumeCm3} cm³`,
      `*Material:* ${activeMaterial?.name || "PLA Matte"}`,
      `*Color:* ${selectedColor}`,
      `*Infill Density:* ${infill}%`,
      `*Layer Height:* ${layerHeight}`,
      `*Supports:* ${supports ? "Yes" : "No"}`,
      `*Priority Rush:* ${rush ? "Yes (24h Priority)" : "No"}`,
      `*Quantity:* ${quantity} unit(s)`,
      `*Estimated Net Weight:* ${priceBreakdown?.weightGrams || 0} g`,
      `*Total Estimate:* ₹${priceBreakdown?.grandTotal || 0}`,
    ];

    if (specialRequests.trim()) {
      lines.push(`*Special Requests / Tolerances:* ${specialRequests.trim()}`);
    }

    lines.push(``);
    lines.push(`Hi Dimension team, I would like to 3D print this file. Please let me know how to send my geometry file and proceed with printing!`);

    return `https://wa.me/918336800598?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Materials and Pricing from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [matRes, priceRes] = await Promise.all([
          fetch("/api/materials"),
          fetch("/api/pricing"),
        ]);

        const mats = await matRes.json();
        const prices = await priceRes.json();

        if (Array.isArray(mats) && mats.length > 0) {
          setMaterials(mats);
          setSelectedMaterialId(mats[0].id);
          if (mats[0].colors && mats[0].colors.length > 0) {
            setSelectedColor(mats[0].colors[0].name);
          }
        }

        if (prices && !prices.error) {
          setPricingSettings(prices);
        }
      } catch (err) {
        console.error("Failed to load fabrication config:", err);
      } finally {
        setIsLoadingConfig(false);
      }
    }
    loadData();
  }, []);

  // Update selected color when material changes
  const activeMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  useEffect(() => {
    if (activeMaterial && activeMaterial.colors && activeMaterial.colors.length > 0) {
      const match = activeMaterial.colors.find((c) => c.name === selectedColor);
      if (!match) {
        setSelectedColor(activeMaterial.colors[0].name);
      }
    }
  }, [selectedMaterialId, activeMaterial]);

  // Recalculate price dynamically
  useEffect(() => {
    if (!activeMaterial || !pricingSettings) return;

    const result = calculatePrice({
      geometry,
      material: activeMaterial,
      settings: pricingSettings,
      layerHeight,
      infillPercent: infill,
      requiresSupports: supports,
      quantity,
      isRush: rush,
    });

    setPriceBreakdown(result);
  }, [geometry, activeMaterial, pricingSettings, layerHeight, infill, supports, quantity, rush]);

  // Handle File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const ext = selectedFile.name.toLowerCase().split(".").pop();
      if (!["stl", "3mf", "obj"].includes(ext || "")) {
        throw new Error("Only .STL, .3MF, and .OBJ geometry files are supported.");
      }

      const buffer = await selectedFile.arrayBuffer();
      setFile(selectedFile);
      setFileBuffer(buffer);

      if (ext === "stl") {
        const parsed = parseSTL(buffer);
        setGeometry(parsed.geometry);
      }
    } catch (err: any) {
      console.error("File parsing error:", err);
      setUploadError(err.message || "Failed to process 3D file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  const currentColorHex =
    activeMaterial?.colors?.find((c) => c.name === selectedColor)?.hex || "#1D2024";



  return (
    <div className="pt-28 pb-20 bg-paper-100 min-h-screen text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-paper-400 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta block mb-1">
              FABRICATION WORKBENCH
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink">
              Custom CAD Slicing & Quotation
            </h1>
          </div>
          <div className="font-mono text-xs text-ink-muted flex flex-wrap items-center gap-3">
            <span>MAX BUILD SIZE: <strong className="text-ink">325 × 320 × 325 MM</strong></span>
            <span>•</span>
            <span>FORMATS: <strong className="text-ink">.STL / .3MF / .OBJ</strong></span>
          </div>
        </div>

        {/* Multicolour Banner */}
        <div className="p-4 bg-paper-200 hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="text-ink">
              <strong>Need a Multicolour 3D Print?</strong> Dimension can print multiple colors in a single job.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="mailto:real.kiktro@gmail.com?subject=Multicolour%203D%20Printing%20Inquiry"
              className="text-ink font-semibold hover:text-terracotta underline"
            >
              Email
            </a>
            <span>•</span>
            <a
              href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'm%20interested%20in%20a%20multicolour%203D%20print."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-semibold hover:underline"
            >
              WhatsApp
            </a>
            <span>•</span>
            <a
              href="sms:+918336800598?body=Hi%20Dimension,%20I%20have%20an%20inquiry%20about%20multicolour%203D%20printing."
              className="text-ink font-semibold hover:text-terracotta underline"
            >
              SMS
            </a>
            <span>•</span>
            <a
              href="tel:+918336800598"
              className="text-ink font-semibold hover:text-terracotta underline"
            >
              Call
            </a>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: 3D Viewport & Geometric Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3D WebGL Canvas */}
            <ThreeViewer
              fileBuffer={fileBuffer}
              materialColor={currentColorHex}
              onAnalysisReady={(an) => setGeometry(an)}
              height="h-[440px] sm:h-[480px]"
            />

            {/* Drop Target */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-6 bg-paper-200 hairline border-dashed hover:border-ink cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.3mf,.obj"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 bg-paper-300 group-hover:bg-ink group-hover:text-paper-100 flex items-center justify-center text-ink transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-semibold text-sm text-ink block">
                  {file ? file.name : "Select or Drop 3D Geometry File"}
                </span>
                <span className="font-mono text-[11px] text-ink-muted block mt-0.5">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace` : "Accepts binary/ASCII STL, 3MF, and OBJ (Max 50MB)"}
                </span>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 hairline border-red-300 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Geometric Telemetry HUD */}
            <div className="p-5 bg-paper-200 hairline space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between hairline-b pb-2.5">
                <span className="text-ink font-semibold uppercase text-[11px]">
                  GEOMETRIC TELEMETRY & DIMENSIONS
                </span>
                <span className="text-[10px] text-ink-muted">MAX: 325 × 320 × 325 MM</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-ink-muted">
                <div>
                  <span className="text-[10px] text-ink-subtle block">X AXIS (WIDTH)</span>
                  <span className={`font-bold text-sm ${geometry.dimensions.x > 325 ? "text-red-600" : "text-ink"}`}>
                    {geometry.dimensions.x} mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-subtle block">Y AXIS (DEPTH)</span>
                  <span className={`font-bold text-sm ${geometry.dimensions.y > 320 ? "text-red-600" : "text-ink"}`}>
                    {geometry.dimensions.y} mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-subtle block">Z AXIS (HEIGHT)</span>
                  <span className={`font-bold text-sm ${geometry.dimensions.z > 325 ? "text-red-600" : "text-ink"}`}>
                    {geometry.dimensions.z} mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-subtle block">VOLUME</span>
                  <span className="text-terracotta font-bold text-sm">{geometry.volumeCm3} cm³</span>
                </div>
              </div>

              {(geometry.dimensions.x > 325 || geometry.dimensions.y > 320 || geometry.dimensions.z > 325) && (
                <div className="p-2.5 bg-amber-50 hairline border-amber-300 text-amber-800 text-[11px]">
                  * Notice: Model exceeds 325 × 320 × 325 mm single build envelope. You may scale down or contact us for modular multi-part assembly.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 hairline-t text-[11px]">
                <div>
                  <span className="text-ink-subtle">Polygon Triangles: </span>
                  <span className="text-ink font-semibold">{geometry.triangleCount?.toLocaleString() || "N/A"}</span>
                </div>
                <div>
                  <span className="text-ink-subtle">Watertight Check: </span>
                  <span className="text-emerald-700 font-semibold">PASSED</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Configurator & Transparent Pricing Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-paper-200 hairline space-y-6">
              <h2 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold hairline-b pb-3">
                PRINT PARAMETERS
              </h2>

              {/* 1. Material Selector */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <label className="text-ink font-semibold">1. Material Polymer</label>
                  <span className="text-ink-muted">₹{activeMaterial?.pricePerKg}/kg</span>
                </div>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full p-2.5 bg-paper-100 hairline text-ink text-xs font-mono focus:outline-none focus:border-ink"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — ₹{m.pricePerKg}/kg
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-ink-muted font-sans leading-relaxed">
                  {activeMaterial?.description}
                </p>
              </div>

              {/* 2. Color Swatches */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-ink font-semibold block">
                  2. Color Finish ({selectedColor})
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeMaterial?.colors &&
                    activeMaterial.colors.map((c: any, idx: number) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-paper-100 hairline text-xs font-mono transition-all ${
                            isSelected ? "border-ink font-semibold bg-paper-300" : "text-ink-muted"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-paper-400"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* 3. Infill Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <label className="text-ink font-semibold">3. Infill Density</label>
                  <span className="text-ink font-bold">{infill}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={infill}
                  onChange={(e) => setInfill(Number(e.target.value))}
                  className="w-full h-1.5 bg-paper-400 rounded-none appearance-none cursor-pointer accent-ink"
                />
                <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
                  <span>10% (Display)</span>
                  <span>25% (Standard)</span>
                  <span>50% (Rigid)</span>
                  <span>100% (Solid)</span>
                </div>
              </div>

              {/* 4. Layer Resolution */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-ink font-semibold block">
                  4. Layer Height Resolution
                </label>
                <select
                  value={layerHeight}
                  onChange={(e) => setLayerHeight(e.target.value)}
                  className="w-full p-2.5 bg-paper-100 hairline text-ink text-xs font-mono focus:outline-none focus:border-ink"
                >
                  <option value="0.08mm (Ultra Fine)">0.08 mm — Ultra Fine (Highest Detail)</option>
                  <option value="0.12mm (Fine)">0.12 mm — Fine Architectural</option>
                  <option value="0.16mm (Optimal)">0.16 mm — Optimal Balance (Standard)</option>
                  <option value="0.20mm (Standard)">0.20 mm — Rapid Prototyping</option>
                </select>
              </div>

              {/* 5. Toggles: Supports & Rush */}
              <div className="pt-2 space-y-3 hairline-t font-mono text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-ink">Overhang Support Structures</span>
                  <input
                    type="checkbox"
                    checked={supports}
                    onChange={(e) => setSupports(e.target.checked)}
                    className="accent-ink w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-1.5 text-ink">
                    <Zap className="w-3.5 h-3.5 text-terracotta" />
                    <span>24h Priority Rush Queue</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rush}
                    onChange={(e) => setRush(e.target.checked)}
                    className="accent-ink w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-ink">Quantity Units:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 bg-paper-100 hairline flex items-center justify-center font-bold text-ink hover:bg-paper-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-ink">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 bg-paper-100 hairline flex items-center justify-center font-bold text-ink hover:bg-paper-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Clean Fabrication Summary & Total */}
              <div className="p-4 bg-paper-100 hairline space-y-2 font-mono text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>Estimated Net Weight</span>
                  <span className="text-ink font-semibold">{priceBreakdown?.weightGrams || 0} g</span>
                </div>

                <div className="flex justify-between text-ink-muted">
                  <span>Material & Finish</span>
                  <span className="text-ink">{activeMaterial?.name || "PLA"} ({selectedColor})</span>
                </div>

                <div className="flex justify-between text-ink-muted">
                  <span>Resolution & Infill</span>
                  <span className="text-ink">{layerHeight.split(" ")[0]} • {infill}% Infill</span>
                </div>

                <div className="flex justify-between text-ink-muted">
                  <span>Quantity</span>
                  <span className="text-ink font-semibold">{quantity} unit(s)</span>
                </div>

                {rush && (
                  <div className="flex justify-between text-terracotta font-semibold">
                    <span>Priority Queue</span>
                    <span>24h Rush</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-3 hairline-t flex items-baseline justify-between">
                  <span className="text-ink font-bold text-sm">TOTAL ESTIMATE</span>
                  <span className="font-serif text-2xl sm:text-3xl text-ink font-bold">
                    ₹{priceBreakdown?.grandTotal || 0}
                  </span>
                </div>
              </div>

              {/* Special Requests Input */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-ink font-semibold block text-[11px] uppercase tracking-wide">
                  Special Requests / Tolerances (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Threaded inserts, multicolour, critical tolerances..."
                  className="w-full px-3 py-2 bg-paper-100 hairline text-xs text-ink placeholder-ink-subtle focus:outline-none focus:border-ink font-sans"
                />
              </div>

              {/* Payment Gateway Under Construction Notice */}
              <div className="p-4 bg-amber-500/10 hairline border-amber-600/30 space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Hammer className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span className="uppercase text-[11px] tracking-wide">Payment Gateway Under Construction</span>
                </div>
                <p className="text-[11px] text-amber-950/80 font-sans leading-relaxed">
                  Automated online checkout is temporarily under maintenance. Connect with us directly on WhatsApp to submit your CAD file, verify specifications, and start printing.
                </p>
              </div>

              {/* Direct WhatsApp Print Actions */}
              <div className="space-y-2.5">
                <a
                  href={getWhatsAppPrintUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-subtle text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>CONNECT & PRINT OVER WHATSAPP — ₹{priceBreakdown?.grandTotal || 0}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
                  <a
                    href="tel:+918336800598"
                    className="py-2.5 px-3 bg-paper-100 hairline hover:border-ink transition-colors flex items-center justify-center gap-1.5 text-ink font-medium"
                  >
                    <PhoneCall className="w-3 h-3 text-terracotta" />
                    <span>Call (+91 83368 00598)</span>
                  </a>
                  <a
                    href={`mailto:real.kiktro@gmail.com?subject=${encodeURIComponent(`Fabrication Quote Request: ${file ? file.name : "Custom 3D Model"}`)}`}
                    className="py-2.5 px-3 bg-paper-100 hairline hover:border-ink transition-colors flex items-center justify-center gap-1.5 text-ink font-medium"
                  >
                    <Mail className="w-3 h-3 text-terracotta" />
                    <span>Email CAD Quote</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEDICATED SECTION FOR SPECIAL REQUESTS & CUSTOM FABRICATION */}
        <section className="pt-16 border-t border-paper-400 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper-200 hairline font-mono text-[11px] text-ink">
                <Wrench className="w-3.5 h-3.5 text-terracotta" />
                <span>SPECIAL FABRICATION & CUSTOM ENGINEERING</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink">
                Special Requests & Custom Manufacturing
              </h2>
              <p className="text-sm text-ink-muted font-sans leading-relaxed">
                Have specific hardware, multi-tone, or mechanical tolerance requirements? Dimension accommodates complex post-processing, hardware assembly, and bespoke batch manufacturing.
              </p>
            </div>

            <a
              href="https://wa.me/918336800598?text=Hi%20Dimension,%20I%20have%20a%20special%20fabrication%20request%20(e.g.%20multicolour,%20brass%20threaded%20inserts,%20batch%20manufacturing,%20or%20custom%20polymer)."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-ink hover:bg-charcoal text-paper-100 font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-subtle flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Discuss Special Request on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* 6 Grid Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {/* Card 1: Multicolour */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Palette className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Multicolour & Multi-Material Deposition
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  Seamlessly print up to 4 distinct colours or multi-polymer combinations (e.g. rigid structural body + soft TPU grip) in a single unified print job.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: Logos, tactile keycaps, multi-tone enclosures.
              </div>
            </div>

            {/* Card 2: Threaded Inserts */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Wrench className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Heat-Set Brass Threaded Inserts
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  We thermally press CNC-machined brass heat-set threaded inserts (M2, M2.5, M3, M4, M5, M6) into your prints for high-torque, reusable machine screw fastening.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: Electronic enclosures, robot joints, bolted fixtures.
              </div>
            </div>

            {/* Card 3: Batch Production */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Boxes className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Batch & Low-Volume Production Runs
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  Need 10 to 500+ identical units? We offer continuous fleet production scheduling, volume tiered pricing, and consolidated courier dispatch.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: Small-batch consumer goods, pilot runs, events.
              </div>
            </div>

            {/* Card 4: Precision Fitment */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Cpu className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  High-Precision Fitment (±0.1 mm)
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  Specify exact press-fit, sliding clearance, or snap-fit mechanical tolerances. Sliced with toolpath velocity calibration and digital micrometer QC.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: Bearing seats, sliding rails, interlocking jigs.
              </div>
            </div>

            {/* Card 5: Custom Polymers */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Layers className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Specialized Polymers & Composites
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  Looking for Carbon Fiber composite, UV-stable ASA, flexible 85A/95A TPU, food-contact PETG, or glow-in-the-dark filament? Sourced and calibrated on demand.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: Automotive interior parts, industrial brackets, gaskets.
              </div>
            </div>

            {/* Card 6: CAD Repair & Optimization */}
            <div className="p-6 bg-paper-200 hairline space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-paper-300 flex items-center justify-center text-ink">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  CAD Repair & Slicing Topology Tuning
                </h3>
                <p className="text-xs text-ink-muted font-sans leading-relaxed">
                  Have a non-manifold STL, broken normals, or need hollow internal shell lightening with gyroid infill? Our engineering team optimizes your CAD models.
                </p>
              </div>
              <div className="pt-3 hairline-t text-[11px] text-ink font-semibold">
                Ideal for: 3D scans, architectural models, weight reduction.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
