import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Cpu, Compass, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-paper-100 text-ink min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper-200 hairline font-mono text-[11px] text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            <span>KIKTRO LABS FABRICATION STUDIO</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink leading-tight">
            Digital designs translated into high-tolerance physical artifacts.
          </h1>

          <p className="text-base sm:text-lg text-ink-muted font-sans leading-relaxed">
            Dimension operates as a specialized additive manufacturing and rapid prototyping studio under KikTro Labs. We engineer functional prototypes, production jigs, architectural models, and bespoke consumer artifacts.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 hairline-t pt-12">
          <div className="p-6 bg-paper-200 hairline space-y-3">
            <span className="font-mono text-xs text-terracotta font-bold">01 / GEOMETRIC INTEGRITY</span>
            <h3 className="font-display font-bold text-lg text-ink">Sub-Millimeter Calibrations</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Every job is sliced using calibrated toolpath velocity curves and dynamic vibration compensation to ensure dimensional tolerances within ±0.1 mm.
            </p>
          </div>

          <div className="p-6 bg-paper-200 hairline space-y-3">
            <span className="font-mono text-xs text-terracotta font-bold">02 / ADVANCED POLYMERS</span>
            <h3 className="font-display font-bold text-lg text-ink">Engineering Composites</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              From architectural matte PLA to carbon-fiber reinforced matrices and impact-dampening 95A elastomers, our materials are selected for real-world mechanical performance.
            </p>
          </div>

          <div className="p-6 bg-paper-200 hairline space-y-3">
            <span className="font-mono text-xs text-terracotta font-bold">03 / KIKTRO LABS HERITAGE</span>
            <h3 className="font-display font-bold text-lg text-ink">Industrial Design Focus</h3>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              As a KikTro Labs company, we bridge the gap between pure digital CAD software and tactile, physical product manufacturing.
            </p>
          </div>
        </div>

        {/* Manufacturing Standards Matrix */}
        <div className="p-8 bg-paper-200 hairline space-y-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold hairline-b pb-3">
            STUDIO CAPABILITIES & PRODUCTION THRESHOLDS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div>
              <span className="text-[10px] text-ink-subtle block">MAX BUILD ENVELOPE</span>
              <span className="text-ink font-bold text-sm">325 × 320 × 325 mm</span>
              <span className="text-ink-muted text-[11px] block mt-1 font-sans">Single monolithic build volume</span>
            </div>

            <div>
              <span className="text-[10px] text-ink-subtle block">LAYER RESOLUTION</span>
              <span className="text-ink font-bold text-sm">0.08 mm — 0.20 mm</span>
              <span className="text-ink-muted text-[11px] block mt-1 font-sans">Ultra-fine to rapid prototyping</span>
            </div>

            <div>
              <span className="text-[10px] text-ink-subtle block">AXIAL TOLERANCE</span>
              <span className="text-ink font-bold text-sm">±0.1 mm</span>
              <span className="text-ink-muted text-[11px] block mt-1 font-sans">Repeatable kinematic fitment</span>
            </div>

            <div>
              <span className="text-[10px] text-ink-subtle block">MULTI-MATERIAL DENSITY</span>
              <span className="text-ink font-bold text-sm">Up to 4 Materials</span>
              <span className="text-ink-muted text-[11px] block mt-1 font-sans">Support interfaces & co-extrusion</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-ink text-paper-100 font-mono text-xs">
          <div>
            <h3 className="font-serif text-2xl text-paper-100 mb-1">
              Have a custom geometry or batch run?
            </h3>
            <p className="text-paper-400 font-sans text-xs">
              Upload your 3D CAD files or talk directly with our studio fabrication team.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/print"
              className="px-6 py-3 bg-paper-100 text-ink font-semibold hover:bg-paper-300 transition-colors"
            >
              LAUNCH 3D SLICER
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-paper-400/40 text-paper-200 hover:text-white"
            >
              INQUIRE BATCH
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
