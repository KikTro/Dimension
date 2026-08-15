import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-paper-400 bg-paper-200 text-ink pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 hairline-b">
          {/* Col 1: Brand & Parent Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-7 h-7 bg-ink text-paper-100 flex items-center justify-center font-serif text-lg italic">
                D
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-ink">
                DIMENSION
              </span>
            </Link>

            <p className="text-sm text-ink-muted font-sans leading-relaxed max-w-sm">
              Digital designs translated into high-tolerance physical objects. Additive manufacturing and rapid digital tooling by KikTro Labs.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-paper-300 font-mono text-[11px] text-ink-muted">
                <span>A <strong className="text-ink font-medium">KikTro Labs</strong> Company</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-4">
              Fabrication
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-ink-muted">
              <li>
                <Link href="/print" className="hover:text-ink transition-colors flex items-center gap-1 group">
                  <span>Custom 3D Printing</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/models" className="hover:text-ink transition-colors flex items-center gap-1 group">
                  <span>Ready-to-Order 3D Models</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink transition-colors">
                  Material Matrix & Tolerances
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Material Engineering */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-4">
              Materials
            </h4>
            <ul className="space-y-2 text-xs font-mono text-ink-muted">
              <li>• PLA Matte (Architectural)</li>
              <li>• PETG Functional (Tough)</li>
              <li>• TPU 95A (Elastomer)</li>
              <li>• ABS / ASA (UV Grade)</li>
              <li>• Carbon Fiber Composite</li>
            </ul>
          </div>

          {/* Col 4: Studio Standards */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-4">
              Standards
            </h4>
            <ul className="space-y-2 text-xs font-mono text-ink-muted">
              <li>• Max: 325 × 320 × 325 mm</li>
              <li>• ±0.1 mm Dimensional Tol.</li>
              <li>• 0.08 mm - 0.20 mm Layers</li>
              <li>• Multicolour Deposition</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Official Contact */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-subtle">
          <div>
            <span>© 2026 KikTro Labs • Dimension 3D Printing</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>real.kiktro@gmail.com</span>
            <span>•</span>
            <span>+91 83368 00598</span>
            <span>•</span>
            <span>Kolkata, West Bengal, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
