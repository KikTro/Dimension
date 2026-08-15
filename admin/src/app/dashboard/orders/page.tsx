"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  const statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Printing",
    "Quality Check",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder({ ...activeOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Order status error:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Delete this order record permanently?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(null);
        }
      }
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = selectedStatus === "All" || o.status === selectedStatus;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Confirmed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Printing":
        return "bg-blue-500/20 text-blue-300 border-blue-400/40 font-semibold";
      case "Quality Check":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Shipped":
      case "Delivered":
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
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <span>STORE CATALOG ORDERS</span>
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            CUSTOMER PHYSICAL MODEL ORDERS & DISPATCH LOGISTICS
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="p-2 rounded-lg bg-admin-card border border-admin-border text-admin-muted hover:text-white"
          title="Refresh Orders"
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
            placeholder="Search by Order #, customer name, email..."
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
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Ordered Artifacts</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-admin-hover transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-admin-muted block">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-white font-medium block">{ord.customerName}</span>
                    <span className="text-[11px] text-admin-muted block font-sans truncate max-w-[140px]">
                      {ord.customerPhone}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {ord.items && ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="text-admin-text">
                        {item.quantity}x {item.name} ({item.color})
                      </div>
                    ))}
                  </td>

                  <td className="py-3.5 px-4 text-white font-bold text-sm">
                    ₹{ord.totalAmount}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border focus:outline-none ${getStatusBadge(
                        ord.status
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
                      onClick={() => setActiveOrder(ord)}
                      className="p-1.5 rounded-lg bg-admin-surface text-admin-text hover:text-white"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(ord.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                      title="Delete Order"
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
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-admin-card border border-admin-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-admin-border pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Order Telemetry: {activeOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="text-admin-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-3">
              <span className="text-[10px] text-admin-muted uppercase tracking-wider block">
                ORDERED PRODUCTS
              </span>
              <div className="divide-y divide-admin-border space-y-2">
                {activeOrder.items && activeOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block">{item.name}</span>
                      <span className="text-[11px] text-admin-muted">
                        {item.material} • {item.color} • SKU: {item.sku || "N/A"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white">{item.quantity}x @ ₹{item.unitPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping */}
            <div className="p-4 rounded-xl bg-admin-surface border border-admin-border space-y-2">
              <span className="text-[10px] text-admin-muted uppercase tracking-wider block">
                DELIVERY INFORMATION
              </span>
              <div className="space-y-1 text-admin-text font-sans">
                <div>Name: <strong className="text-white font-mono">{activeOrder.customerName}</strong></div>
                <div>Email: <strong className="text-white font-mono">{activeOrder.customerEmail}</strong></div>
                <div>Phone: <strong className="text-white font-mono">{activeOrder.customerPhone}</strong></div>
                <div>Address: <span className="text-admin-text">{activeOrder.customerAddress}</span></div>
                {activeOrder.notes && (
                  <div className="pt-2 text-xs text-amber-400 font-mono">
                    Notes: {activeOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-admin-bg border border-admin-border">
              <div>
                <span className="text-[10px] text-admin-muted block">TOTAL AMOUNT</span>
                <span className="text-xl font-bold text-white">
                  ₹{activeOrder.totalAmount}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-admin-muted block mb-1">FULFILLMENT STATUS</span>
                <select
                  value={activeOrder.status}
                  onChange={(e) => handleStatusChange(activeOrder.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs ${getStatusBadge(
                    activeOrder.status
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
