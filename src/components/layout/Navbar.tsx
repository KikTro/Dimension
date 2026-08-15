"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Custom Fabrication", href: "/print" },
    { name: "3D Models", href: "/models" },
    { name: "Materiality & Lab", href: "/about" },
    { name: "Inquiries", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FBFBF9]/95 backdrop-blur-md hairline-b py-3.5 shadow-subtle"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Architectural Typographic Mark */}
          <div className="w-7 h-7 bg-ink text-paper-100 flex items-center justify-center font-serif text-lg italic transition-transform group-hover:scale-105">
            D
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-base tracking-tight text-ink">
                DIMENSION
              </span>
              <span className="text-[10px] font-mono text-ink-subtle uppercase">
                STUDIO
              </span>
            </div>
            <span className="text-[9px] font-mono text-ink-subtle tracking-wider uppercase">
              BY KIKTRO LABS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-ink-muted">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors relative py-1 ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-terracotta" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/print"
            className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-charcoal text-paper-100 font-mono text-xs font-medium transition-all"
          >
            <span>UPLOAD CAD SHAPE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink hover:text-charcoal focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper-100 border-b border-paper-400 px-6 pt-4 pb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 gap-2 font-mono text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-2 px-3 transition-colors ${
                    isActive
                      ? "bg-paper-300 text-ink font-semibold"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-paper-300">
            <Link
              href="/print"
              className="w-full flex items-center justify-center gap-2 py-3 bg-ink text-paper-100 font-mono text-xs font-medium"
            >
              <span>UPLOAD CAD SHAPE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
