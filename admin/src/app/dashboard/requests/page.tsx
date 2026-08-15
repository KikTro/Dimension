"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

export default function AdminPrintRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);

  const statuses = [
    "All",
    "New",
    "Reviewing",
    "Quoted",
    "Confirmed",
    "Printing",
    "Quality Check",
    "Ready",
    "Completed",
    "Cancelled",
  ];

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
        );
        if (activeRequest && activeRequest.id === requestId) {
          setActiveRequest({ ...activeRequest, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Delete this print request permanently?")) return;
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        if (activeRequest && activeRequest.id === requestId) {
          setActiveRequest(null);
        }
      }
    } catch (err) {
      console.error("Delete request error:", err);
    }
  };

  const filtered = requests.filter((r) => {
    const matchStatus = selectedStatus === "All" || r.status === selectedStatus;
    const matchSearch =
      r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Reviewing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Confirmed":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Printing":
        return "bg-blue-500/20 text-blue-300 border-blue-400/40 font-semibold";
      case "Quality Check":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Ready":
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-admin-surface text-admin-muted border-admin-border";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <span>CUSTOM PRINT REQUESTS QUEUE</span>
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            INCOMING CAD GEOMETRIES, MATERIAL SPECS & FABRICATION PIPELINE
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRequests}
          className="p-2 rounded-lg bg-admin-card border border-admin-border text-admin-muted hover:text-white"
          title="Refresh Queue"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="space-y-3 font-mono text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-admin-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, customer, file name, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-admin-card border border-admin-border text-white placeholder-admin-muted focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {statuses.map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-admin-card border border-admin-border text-admin-muted hover:text-white"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-admin-card border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-admin-surface border-b border-admin-border text-admin-muted text-[11px] uppercase">
              <tr>
                <th className="py-3.5 px-4">Request #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">File & Material</th>
                <th className="py-3.5 px-4">Specs (Weight/Qty)</th>
                <th className="py-3.5 px-4">Calculated Quote</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-admin-hover transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{req.requestNumber}</span>
                    <span className="text-[10px] text-admin-muted block">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white font-medium block">{req.customerName}</span>
                    <span className="text-[11px] text-admin-muted block font-sans truncate max-w-[140px]">
                      {req.customerEmail}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white font-semibold truncate max-w-xs">
                      {req.fileName}
                    </div>
                    <div className="text-[11px] text-admin-muted">
                      {req.material} • <span className="text-white">{req.color}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-admin-text">
                    <div>{req.estimatedWeight}g • {req.quantity}x unit</div>
                    <div className="text-[10px] text-admin-muted">
                      {req.infill}% infill • {req.layerHeight}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-white font-bold text-sm">
                    ₹{req.estimatedPrice}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border focus:outline-none ${getStatusBadge(
                        req.status
                      )} bg-admin-surface`}
                    >
                      {statuses
                        .filter((s) => s !== "All")
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveRequest(req)}
                      className="p-1.5 rounded-lg bg-admin-surface text-admin-text hover:text-white"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                      title="Delete Request"
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

      {/* DETAIL MODAL */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-admin-card border border-admin-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Request Telemetry: {activeRequest.requestNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="text-admin-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Geometric Measurements */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <span className="text-[10px] text-admin-muted uppercase tracking-wider block">
                3D CAD GEOMETRY & CALCULATIONS
              </span>
              <div className="grid grid-cols-2 gap-2 text-admin-text">
                <div>File: <strong className="text-white">{activeRequest.fileName}</strong></div>
                <div>Volume: <strong className="text-blue-400">{activeRequest.volumeCm3 || "N/A"} cm³</strong></div>
                <div>
                  Bounds:{" "}
                  <strong className="text-white">
                    {activeRequest.dimensionsX} × {activeRequest.dimensionsY} × {activeRequest.dimensionsZ} mm
                  </strong>
                </div>
                <div>Weight: <strong className="text-white">{activeRequest.estimatedWeight} g</strong></div>
              </div>
            </div>

            {/* Print Parameters */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <span className="text-[10px] text-admin-muted uppercase tracking-wider block">
                CONFIGURATION
              </span>
              <div className="grid grid-cols-2 gap-2 text-admin-text">
                <div>Material: <strong className="text-white">{activeRequest.material}</strong></div>
                <div>Color: <strong className="text-white">{activeRequest.color}</strong></div>
                <div>Infill: <strong className="text-white">{activeRequest.infill}%</strong></div>
                <div>Layer: <strong className="text-white">{activeRequest.layerHeight}</strong></div>
                <div>Supports: <strong className="text-white">{activeRequest.supports ? "Yes" : "No"}</strong></div>
                <div>Quantity: <strong className="text-white">{activeRequest.quantity}x</strong></div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <span className="text-[10px] text-admin-muted uppercase tracking-wider block">
                CUSTOMER & SHIPPING DETAILS
              </span>
              <div className="space-y-1 text-admin-text font-sans">
                <div>Name: <strong className="text-white font-mono">{activeRequest.customerName}</strong></div>
                <div>Email: <strong className="text-white font-mono">{activeRequest.customerEmail}</strong></div>
                <div>Phone: <strong className="text-white font-mono">{activeRequest.customerPhone}</strong></div>
                <div>Address: <span className="text-admin-text">{activeRequest.customerAddress || "N/A"}</span></div>
                {activeRequest.notes && (
                  <div className="pt-2 text-xs text-amber-400 font-mono">
                    Notes: {activeRequest.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-admin-bg border border-admin-border">
              <div>
                <span className="text-[10px] text-admin-muted block">TOTAL ESTIMATE</span>
                <span className="text-xl font-bold text-white">
                  ₹{activeRequest.estimatedPrice}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-admin-muted block mb-1">PIPELINE STATUS</span>
                <select
                  value={activeRequest.status}
                  onChange={(e) => handleStatusChange(activeRequest.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs ${getStatusBadge(
                    activeRequest.status
                  )} bg-admin-surface`}
                >
                  {statuses
                    .filter((s) => s !== "All")
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
