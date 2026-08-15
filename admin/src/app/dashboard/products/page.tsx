"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Editor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(490);
  const [category, setCategory] = useState("Desk & Studio");
  const [materials, setMaterials] = useState("PLA Matte (Architectural Grade), PETG Functional (High Toughness)");
  const [colors, setColors] = useState("Graphite Charcoal, Paper Off-White, Terracotta Umber");
  const [dimensions, setDimensions] = useState("110 × 80 × 50 mm");
  const [printTime, setPrintTime] = useState("2h 30m");
  const [sku, setSku] = useState("");
  const [images, setImages] = useState(
    "https://images.unsplash.com/photo-1586775490184-b79f0621891f?q=80&w=1200&auto=format&fit=crop"
  );
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNewModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice(490);
    setCategory("Desk & Studio");
    setMaterials("PLA Matte (Architectural Grade), PETG Functional (High Toughness)");
    setColors("Graphite Charcoal, Paper Off-White, Terracotta Umber");
    setDimensions("110 × 80 × 50 mm");
    setPrintTime("2h 30m");
    setSku(`DIM-DSK-${Math.floor(100 + Math.random() * 900)}`);
    setImages("https://images.unsplash.com/photo-1586775490184-b79f0621891f?q=80&w=1200&auto=format&fit=crop");
    setFeatured(false);
    setActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description || "");
    setPrice(prod.price);
    setCategory(prod.category);
    setMaterials(Array.isArray(prod.materials) ? prod.materials.join(", ") : prod.materials);
    setColors(Array.isArray(prod.colors) ? prod.colors.join(", ") : prod.colors);
    setDimensions(prod.dimensions || "");
    setPrintTime(prod.printTime || "");
    setSku(prod.sku || "");
    setImages(Array.isArray(prod.images) ? prod.images.join("\n") : prod.images);
    setFeatured(Boolean(prod.featured));
    setActive(Boolean(prod.active));
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const materialsArray = materials.split(",").map((s) => s.trim()).filter(Boolean);
    const colorsArray = colors.split(",").map((s) => s.trim()).filter(Boolean);
    const imagesArray = images.split("\n").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      materials: materialsArray,
      colors: colorsArray,
      dimensions,
      printTime,
      sku,
      images: imagesArray,
      featured,
      active,
    };

    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to save product");
      }
    } catch (err) {
      console.error("Save product error:", err);
      setErrorMessage("Network error while saving product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (prod: any) => {
    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !prod.active }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, active: !p.active } : p))
        );
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Box className="w-6 h-6 text-blue-500" />
            <span>PRODUCT CATALOG MANAGEMENT</span>
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            CONTROL PHYSICAL PRODUCTS AVAILABLE IN STOREFRONT
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ ADD PRODUCT</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-admin-card border border-admin-border flex items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-admin-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, category, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-admin-surface border border-admin-border text-xs text-white placeholder-admin-muted focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-admin-muted">
          Showing {filtered.length} products
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-admin-card border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-admin-surface border-b border-admin-border text-admin-muted text-[11px] uppercase">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Storefront Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-admin-hover transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-admin-surface flex-shrink-0">
                        {prod.images && prod.images[0] ? (
                          <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-admin-muted">
                            3D
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-white block text-sm">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-admin-muted block truncate max-w-xs font-sans">
                          {prod.dimensions} • {prod.printTime}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-white font-semibold">{prod.sku}</td>
                  <td className="py-3.5 px-4 text-admin-muted">{prod.category}</td>
                  <td className="py-3.5 px-4 text-white font-bold">₹{prod.price}</td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                        prod.active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.active ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span>{prod.active ? "Active" : "Disabled"}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    {prod.featured ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-admin-muted">No</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg bg-admin-surface text-admin-text hover:text-white hover:bg-blue-600 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(prod)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-admin-card border border-admin-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Edit Product" : "Create New Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-admin-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-admin-text">PRODUCT NAME *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Monolith Device Stand"
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-admin-text">CATEGORY *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Desk & Studio">Desk & Studio</option>
                    <option value="Mechanical & Robotics">Mechanical & Robotics</option>
                    <option value="Architectural Objects">Architectural Objects</option>
                    <option value="Custom Utility">Custom Utility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-admin-text">PRICE (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-admin-text">DIMENSIONS</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="120 × 85 × 45 mm"
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-admin-text">PRINT TIME</label>
                  <input
                    type="text"
                    value={printTime}
                    onChange={(e) => setPrintTime(e.target.value)}
                    placeholder="2h 45m"
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">SKU IDENTIFIER *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="DIM-DSK-001"
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Design narrative and technical specifications..."
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">AVAILABLE MATERIALS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="PLA Matte (Architectural Grade), PETG Functional (High Toughness)"
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">AVAILABLE COLORS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Graphite Charcoal, Paper Off-White, Terracotta Umber"
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">IMAGE URLS (ONE PER LINE)</label>
                <textarea
                  rows={2}
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-admin-surface border-admin-border text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-admin-text">Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded bg-admin-surface border-admin-border text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-admin-text">Active in Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-admin-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-admin-surface text-admin-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-admin-card border border-red-900/50 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-base text-white">
                Delete Product?
              </h3>
            </div>

            <p className="text-admin-text font-sans leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong> ({deleteTarget.sku})?
            </p>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-admin-surface text-admin-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
