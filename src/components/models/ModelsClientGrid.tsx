"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import {
  Search,
  ArrowUpRight,
  Sparkles,
  Mail,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  X,
  Send,
  CheckCircle2,
} from "lucide-react";

interface ModelsClientGridProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ModelsClientGrid({
  initialProducts,
  categories,
}: ModelsClientGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Custom Model Inquiry Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryDesc, setInquiryDesc] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filtered = initialProducts
    .filter((prod) => {
      const matchCat =
        selectedCategory === "All" || prod.category === selectedCategory;
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") {
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 3D models by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-paper-200 hairline text-xs text-ink placeholder-ink-subtle focus:outline-none focus:border-ink font-sans"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-ink-subtle text-[11px] uppercase">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-paper-200 hairline text-ink text-xs focus:outline-none focus:border-ink"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["All", ...categories].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-ink text-paper-100 font-semibold"
                    : "bg-paper-200 text-ink-muted hover:text-ink hairline"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Payment Gateway Under Construction Notice Banner */}
        <div className="p-3.5 bg-amber-500/10 hairline border-amber-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse flex-shrink-0" />
            <span className="text-amber-950 font-medium font-sans">
              <strong>Payment Gateway Under Construction:</strong> Connect directly with us to print and order 3D models over WhatsApp.
            </span>
          </div>
          <a
            href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'm%20interested%20in%20ordering%20a%203D%20model."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 hover:text-emerald-950 font-semibold underline whitespace-nowrap flex items-center gap-1 text-[11px] font-mono"
          >
            <span>WhatsApp (+91 83368 00598) →</span>
          </a>
        </div>
      </div>

      {/* Catalog Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => (
            <Link
              key={prod.id}
              href={`/models/${prod.slug || prod.id}`}
              className="group flex flex-col bg-paper-100 hairline hover:border-ink transition-all"
            >
              {/* Product Visual */}
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

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2.5 py-1 bg-ink text-paper-100 font-mono text-[10px] flex items-center gap-1">
                    <span>VIEW MODEL</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display font-bold text-base text-ink group-hover:text-terracotta transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <span className="font-mono text-xs text-ink font-bold">
                      ₹{prod.price}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted font-sans line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="pt-3 hairline-t flex items-center justify-between font-mono text-[11px] text-ink-subtle">
                  <span>{prod.dimensions}</span>
                  <span>{prod.printTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-paper-200 hairline space-y-3 font-mono text-xs">
          <p className="text-ink-muted">
            No models match the selected search or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-ink text-paper-100"
          >
            RESET FILTERS
          </button>
        </div>
      )}

      {/* 6. "WANT A MODEL MADE?" CUSTOM MODEL BANNER & FLOW */}
      <div className="p-8 sm:p-10 bg-paper-200 hairline space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-xs text-terracotta font-semibold uppercase block">
              CAN'T FIND WHAT YOU'RE LOOKING FOR?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink">
              Want us to make a 3D model for you?
            </h3>
            <p className="text-sm text-ink-muted font-sans leading-relaxed">
              If you have an idea, reference photo, sketch, or need a replacement part designed from scratch, our team can create and 3D print a custom model for you.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-ink hover:bg-charcoal text-paper-100 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-subtle"
            >
              <span>ENQUIRE ABOUT A CUSTOM MODEL</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Direct Contact Options */}
        <div className="pt-4 hairline-t flex flex-wrap items-center gap-6 font-mono text-xs text-ink-muted">
          <span className="text-ink font-semibold">Or reach us directly:</span>

          <a
            href="mailto:real.kiktro@gmail.com?subject=Custom%203D%20Model%20Request"
            className="hover:text-ink flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-terracotta" />
            <span>real.kiktro@gmail.com</span>
          </a>

          <a
            href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'd%20like%20to%20get%20a%20custom%203D%20model%20designed."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp (+91 83368 00598)</span>
          </a>

          <a
            href="tel:+918336800598"
            className="hover:text-ink flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-terracotta" />
            <span>Call (+91 83368 00598)</span>
          </a>
        </div>
      </div>

      {/* CUSTOM MODEL ENQUIRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-paper-100 hairline shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            {isSubmitted ? (
              <div className="text-center space-y-4 py-6 font-mono">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-ink">
                  Custom Model Request Sent
                </h3>
                <p className="text-xs text-ink-muted font-sans max-w-sm mx-auto">
                  Thank you, {inquiryName}. We will review your custom 3D model requirements and get in touch with an estimate.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-ink text-paper-100 text-xs font-mono"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between hairline-b pb-3 font-mono">
                  <div>
                    <span className="text-[10px] text-terracotta uppercase block">CUSTOM DESIGN INQUIRY</span>
                    <h3 className="font-serif text-xl text-ink">Tell Us What You Need Made</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-ink-muted hover:text-ink"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-emerald-500/10 hairline border-emerald-600/30 flex items-center justify-between gap-3 text-xs">
                  <span className="text-emerald-950 font-sans text-[11px]">
                    Want faster turnaround? Message our engineers directly on WhatsApp.
                  </span>
                  <a
                    href="https://wa.me/918336800598?text=Hi%20Dimension,%20I'd%20like%20to%20get%20a%20custom%203D%20model%20designed."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[10px] uppercase font-semibold flex items-center gap-1 whitespace-nowrap"
                  >
                    <MessageCircle className="w-3 h-3 fill-current" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-ink">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Priya Das"
                      className="w-full px-3 py-2 bg-paper-200 hairline text-ink focus:outline-none focus:border-ink font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-ink">EMAIL *</label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-3 py-2 bg-paper-200 hairline text-ink focus:outline-none focus:border-ink font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-ink">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="+91 83368 00598"
                        className="w-full px-3 py-2 bg-paper-200 hairline text-ink focus:outline-none focus:border-ink font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-ink">MODEL DESCRIPTION & APPROXIMATE SIZE *</label>
                    <textarea
                      rows={4}
                      required
                      value={inquiryDesc}
                      onChange={(e) => setInquiryDesc(e.target.value)}
                      placeholder="Describe what you want made, dimensions, reference links, or purpose..."
                      className="w-full px-3 py-2 bg-paper-200 hairline text-ink focus:outline-none focus:border-ink font-sans"
                    />
                  </div>

                  <div className="pt-4 hairline-t flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-paper-200 text-ink-muted hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-ink text-paper-100 font-semibold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT ENQUIRY</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
