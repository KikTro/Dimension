"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Save, CheckCircle2, Calculator, Zap } from "lucide-react";

export default function AdminPricingSettingsPage() {
  const [settings, setSettings] = useState({
    id: "default",
    minimumCharge: 150.0,
    machineFee: 45.0,
    supportFee: 25.0,
    finishingFee: 20.0,
    packagingFee: 30.0,
    shippingFee: 70.0,
    rushMultiplier: 1.35,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulator
  const [simVolume, setSimVolume] = useState<number>(45);
  const [simInfill, setSimInfill] = useState<number>(25);
  const [simRatePerKg, setSimRatePerKg] = useState<number>(850);
  const [simSupports, setSimSupports] = useState<boolean>(false);
  const [simQuantity, setSimQuantity] = useState<number>(1);
  const [simRush, setSimRush] = useState<boolean>(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/pricing");
        const data = await res.json();
        if (data && !data.error) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch pricing settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save pricing error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Math simulation
  const infillRatio = Math.max(0.1, Math.min(1.0, simInfill / 100));
  const effectiveVol = simVolume * (0.22 + 0.78 * infillRatio) * (simSupports ? 1.15 : 1.0);
  const simWeightGrams = Number((effectiveVol * 1.24).toFixed(1));
  const simMatCost = (simWeightGrams / 1000) * simRatePerKg;
  const simSupportFee = simSupports ? settings.supportFee : 0;

  let unitBase = simMatCost + settings.machineFee + simSupportFee + settings.finishingFee;
  let minApplied = false;
  if (unitBase < settings.minimumCharge) {
    unitBase = settings.minimumCharge;
    minApplied = true;
  }

  const simSubtotal = unitBase * simQuantity;
  const simRushFee = simRush ? simSubtotal * (settings.rushMultiplier - 1.0) : 0;
  const simGrandTotal = Number((simSubtotal + simRushFee + settings.packagingFee + settings.shippingFee).toFixed(2));

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-500" />
            <span>PRICING ENGINE & COST PARAMETERS</span>
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            DYNAMIC FEES APPLIED TO ALL INCOMING 3D PRINTING CALCULATIONS
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pricing Config Saved in Database</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-admin-card border border-admin-border space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <h3 className="font-bold text-base text-white">
                Base Fees & Charge Rules
              </h3>
              <span className="text-admin-muted text-[11px]">All values in INR (₹)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Minimum Print Charge */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Minimum Print Charge</label>
                  <span className="text-[10px] text-blue-400">FLOOR</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  The base threshold for any custom 3D file order.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.minimumCharge}
                    onChange={(e) =>
                      setSettings({ ...settings, minimumCharge: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Machine Setup Fee */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Machine Setup Fee</label>
                  <span className="text-[10px] text-admin-muted">RUNTIME</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  Nozzle priming, bed prep, and initial layer overhead.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.machineFee}
                    onChange={(e) =>
                      setSettings({ ...settings, machineFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Support Fee */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Support Material Fee</label>
                  <span className="text-[10px] text-admin-muted">IF ACTIVE</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  Additional fee when overhang support structures are requested.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.supportFee}
                    onChange={(e) =>
                      setSettings({ ...settings, supportFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Finishing Fee */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Finishing & QC Fee</label>
                  <span className="text-[10px] text-admin-muted">PER PIECE</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  Deburring, caliper inspection, and surface cleanup.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.finishingFee}
                    onChange={(e) =>
                      setSettings({ ...settings, finishingFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Packaging Fee */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Packaging Fee</label>
                  <span className="text-[10px] text-admin-muted">BOX & FOAM</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  Protective custom boxing and desiccant packing.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.packagingFee}
                    onChange={(e) =>
                      setSettings({ ...settings, packagingFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Shipping Fee */}
              <div className="space-y-1.5 p-4 rounded-xl bg-admin-surface border border-admin-border">
                <div className="flex items-center justify-between">
                  <label className="text-white font-semibold">Courier / Shipping Fee</label>
                  <span className="text-[10px] text-admin-muted">STANDARD</span>
                </div>
                <p className="text-[11px] text-admin-muted font-sans">
                  Doorstep tracked courier delivery across all PIN codes.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-admin-muted">₹</span>
                  <input
                    type="number"
                    step="1"
                    required
                    value={settings.shippingFee}
                    onChange={(e) =>
                      setSettings({ ...settings, shippingFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-admin-bg border border-admin-border text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Rush Multiplier */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Rush Queue Multiplier</span>
                </label>
                <span className="text-amber-400 font-bold">{settings.rushMultiplier}x (+{((settings.rushMultiplier - 1) * 100).toFixed(0)}%)</span>
              </div>
              <p className="text-[11px] text-admin-muted font-sans">
                Multiplier applied on subtotal when customer requests 24h queue priority.
              </p>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={settings.rushMultiplier}
                onChange={(e) =>
                  setSettings({ ...settings, rushMultiplier: Number(e.target.value) })
                }
                className="w-full h-2 bg-admin-bg rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Updating Settings..." : "Save Pricing Configuration"}</span>
            </button>
          </div>
        </form>

        {/* Live Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-admin-card border border-admin-border space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <span>Live Quote Simulator</span>
              </h3>
              <span className="text-[11px] text-admin-muted">TEST BENCH</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-admin-muted mb-1">
                  <span>Model Volume: {simVolume} cm³</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={simVolume}
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-admin-surface rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-admin-muted mb-1">
                  <span>Infill Density: {simInfill}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={simInfill}
                  onChange={(e) => setSimInfill(Number(e.target.value))}
                  className="w-full h-1.5 bg-admin-surface rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-admin-muted mb-1">
                  <span>Filament Rate: ₹{simRatePerKg}/kg</span>
                </div>
                <input
                  type="range"
                  min="700"
                  max="2500"
                  step="50"
                  value={simRatePerKg}
                  onChange={(e) => setSimRatePerKg(Number(e.target.value))}
                  className="w-full h-1.5 bg-admin-surface rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-admin-text">
                  <input
                    type="checkbox"
                    checked={simSupports}
                    onChange={(e) => setSimSupports(e.target.checked)}
                    className="rounded bg-admin-surface border-admin-border text-blue-600"
                  />
                  <span>Includes Supports (+₹{settings.supportFee})</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-admin-text">
                  <input
                    type="checkbox"
                    checked={simRush}
                    onChange={(e) => setSimRush(e.target.checked)}
                    className="rounded bg-admin-surface border-admin-border text-blue-600"
                  />
                  <span>Rush Queue ({settings.rushMultiplier}x)</span>
                </label>
              </div>
            </div>

            {/* Simulated Breakdown */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <div className="flex justify-between text-admin-muted">
                <span>Filament Weight</span>
                <span className="text-white">{simWeightGrams} g</span>
              </div>
              <div className="flex justify-between text-admin-muted">
                <span>Material Cost</span>
                <span className="text-white">₹{simMatCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-admin-muted">
                <span>Machine Setup</span>
                <span className="text-white">₹{settings.machineFee.toFixed(2)}</span>
              </div>
              {simSupports && (
                <div className="flex justify-between text-admin-muted">
                  <span>Support Fee</span>
                  <span className="text-white">₹{settings.supportFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-admin-muted">
                <span>Finishing & QC</span>
                <span className="text-white">₹{settings.finishingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-admin-muted">
                <span>Packaging & Courier</span>
                <span className="text-white">₹{(settings.packagingFee + settings.shippingFee).toFixed(2)}</span>
              </div>

              {minApplied && (
                <div className="text-[10px] text-amber-400 bg-amber-950/20 p-1.5 rounded">
                  * Minimum charge threshold applied.
                </div>
              )}

              <div className="pt-2 border-t border-admin-border flex items-baseline justify-between">
                <span className="text-admin-muted">Simulated Total:</span>
                <span className="font-bold text-xl text-white">
                  ₹{simGrandTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
