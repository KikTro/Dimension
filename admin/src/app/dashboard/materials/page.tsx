"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [pricePerKg, setPricePerKg] = useState<number>(900);
  const [density, setDensity] = useState<number>(1.24);
  const [description, setDescription] = useState("");
  const [nozzleTemp, setNozzleTemp] = useState("215-230°C");
  const [bedTemp, setBedTemp] = useState("55-65°C");
  const [tensile, setTensile] = useState("55 MPa");
  const [impact, setImpact] = useState("Moderate");
  const [colorsText, setColorsText] = useState("Graphite Charcoal:#1D2024, Paper Off-White:#F3F2EE, Terracotta Umber:#B85834");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/materials");
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const openNewModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setPricePerKg(950);
    setDensity(1.24);
    setDescription("");
    setNozzleTemp("220-235°C");
    setBedTemp("60°C");
    setTensile("50 MPa");
    setImpact("High");
    setColorsText("Graphite Charcoal:#1D2024, Paper Off-White:#F3F2EE, Terracotta Umber:#B85834");
    setActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mat: any) => {
    setIsEditing(true);
    setEditingId(mat.id);
    setName(mat.name);
    setPricePerKg(mat.pricePerKg);
    setDensity(mat.density);
    setDescription(mat.description || "");
    setNozzleTemp(mat.nozzleTemp || "");
    setBedTemp(mat.bedTemp || "");
    setTensile(mat.tensile || "");
    setImpact(mat.impact || "");

    const colorsString =
      mat.colors && Array.isArray(mat.colors)
        ? mat.colors.map((c: any) => `${c.name}:${c.hex}`).join(", ")
        : "";
    setColorsText(colorsString);

    setActive(Boolean(mat.active));
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const parsedColors = colorsText
      .split(",")
      .map((part) => {
        const [cName, cHex] = part.split(":");
        return {
          name: cName?.trim() || "Black",
          hex: cHex?.trim() || "#1D2024",
        };
      })
      .filter((c) => c.name);

    const payload = {
      name,
      pricePerKg: Number(pricePerKg),
      density: Number(density),
      description,
      nozzleTemp,
      bedTemp,
      tensile,
      impact,
      colors: parsedColors,
      active,
    };

    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/materials/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchMaterials();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to save material");
      }
    } catch (err) {
      console.error("Save material error:", err);
      setErrorMessage("Network error while saving material");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (mat: any) => {
    try {
      const res = await fetch(`/api/admin/materials/${mat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !mat.active }),
      });
      if (res.ok) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === mat.id ? { ...m, active: !m.active } : m))
        );
      }
    } catch (err) {
      console.error("Toggle material active error:", err);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/materials/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete material error:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-500" />
            <span>MATERIALS & FILAMENT MATRIX</span>
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            SET ₹/KG RATES, DENSITY, AND ACTIVE COLOR SWATCHES
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ ADD MATERIAL</span>
        </button>
      </div>

      {/* Materials Table */}
      <div className="rounded-2xl bg-admin-card border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-admin-surface border-b border-admin-border text-admin-muted text-[11px] uppercase">
              <tr>
                <th className="py-3.5 px-4">Material Name</th>
                <th className="py-3.5 px-4">Rate (₹ / kg)</th>
                <th className="py-3.5 px-4">Density</th>
                <th className="py-3.5 px-4">Available Swatches</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-admin-hover transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">
                      {mat.name}
                    </div>
                    <div className="text-[11px] text-admin-muted truncate max-w-sm font-sans mt-0.5">
                      {mat.description}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white font-bold text-sm">₹{mat.pricePerKg}</span>
                    <span className="text-admin-muted text-[10px]"> / kg</span>
                  </td>

                  <td className="py-3.5 px-4 text-admin-text">
                    {mat.density} g/cm³
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {mat.colors && mat.colors.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          title={`${c.name} (${c.hex})`}
                          className="w-4 h-4 rounded-full border border-admin-border"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(mat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                        mat.active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${mat.active ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span>{mat.active ? "Active" : "Disabled"}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(mat)}
                      className="p-1.5 rounded-lg bg-admin-surface text-admin-text hover:text-white hover:bg-blue-600 transition-colors"
                      title="Edit Material"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(mat)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                      title="Delete Material"
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
          <div className="w-full max-w-xl bg-admin-card border border-admin-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Edit Material" : "Add Material Grade"}
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

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-admin-text">MATERIAL NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. PLA Matte (Architectural Grade)"
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-admin-text">PRICE PER KG (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-admin-text">DENSITY (g/cm³) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-admin-text">NOZZLE TEMP</label>
                  <input
                    type="text"
                    value={nozzleTemp}
                    onChange={(e) => setNozzleTemp(e.target.value)}
                    placeholder="210-230°C"
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-admin-text">BED TEMP</label>
                  <input
                    type="text"
                    value={bedTemp}
                    onChange={(e) => setBedTemp(e.target.value)}
                    placeholder="55-65°C"
                    className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">
                  COLOR PALETTE (FORMAT: Name:#HEX, Name:#HEX)
                </label>
                <input
                  type="text"
                  value={colorsText}
                  onChange={(e) => setColorsText(e.target.value)}
                  placeholder="Graphite Charcoal:#1D2024, Paper Off-White:#F3F2EE"
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-admin-text">TECHNICAL DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mechanical properties, recommended use cases..."
                  className="w-full px-3 py-2 rounded-xl bg-admin-surface border border-admin-border text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded bg-admin-surface border-admin-border text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-admin-text">Active (Available in 3D Slicer Configurator)</span>
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
                  {isSaving ? "Saving..." : isEditing ? "Update Material" : "Save Material"}
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
                Delete Material?
              </h3>
            </div>

            <p className="text-admin-text font-sans leading-relaxed">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
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
                onClick={handleDeleteMaterial}
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
