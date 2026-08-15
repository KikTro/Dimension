import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  FileText,
  Box,
  Layers,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

export const revalidate = 0;

async function getDashboardMetrics() {
  try {
    const [
      totalProducts,
      activeProducts,
      totalMaterials,
      activeMaterials,
      printRequests,
      orders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.material.count(),
      prisma.material.count({ where: { active: true } }),
      prisma.printRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    const allRequests = await prisma.printRequest.findMany();
    const allOrders = await prisma.order.findMany();

    const totalRevenue =
      allOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) +
      allRequests
        .filter((r: any) => ["Confirmed", "Printing", "Quality Check", "Ready", "Completed"].includes(r.status))
        .reduce((sum: number, r: any) => sum + (r.estimatedPrice || 0), 0);

    const pendingRequestsCount = allRequests.filter((r: any) => ["New", "Reviewing"].includes(r.status)).length;
    const activePrintingCount =
      allRequests.filter((r: any) => r.status === "Printing").length +
      allOrders.filter((o: any) => o.status === "Printing").length;

    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
    }));

    return {
      metrics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalPrintRequests: allRequests.length,
        pendingRequestsCount,
        activePrintingCount,
        totalProducts,
        activeProducts,
        totalMaterials,
        activeMaterials,
        totalOrders: allOrders.length,
      },
      recentRequests: printRequests,
      recentOrders: parsedOrders,
    };
  } catch (err) {
    console.error("Dashboard metrics error:", err);
    return {
      metrics: {
        totalRevenue: 0,
        totalPrintRequests: 0,
        pendingRequestsCount: 0,
        activePrintingCount: 0,
        totalProducts: 0,
        activeProducts: 0,
        totalMaterials: 0,
        activeMaterials: 0,
        totalOrders: 0,
      },
      recentRequests: [],
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { metrics, recentRequests, recentOrders } = await getDashboardMetrics();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-admin-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
            OPERATIONS OVERVIEW
          </h1>
          <p className="text-xs font-mono text-admin-muted mt-1">
            REAL-TIME ADDITIVE FABRICATION METRICS & ORDER PIPELINE
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Revenue */}
        <div className="p-5 rounded-2xl bg-admin-card border border-admin-border space-y-2">
          <div className="flex items-center justify-between text-xs text-admin-muted">
            <span>TOTAL REVENUE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            ₹{metrics.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-admin-muted block">
            Store Orders + Custom Quotes
          </span>
        </div>

        {/* Card 2: Print Requests */}
        <div className="p-5 rounded-2xl bg-admin-card border border-admin-border space-y-2">
          <div className="flex items-center justify-between text-xs text-admin-muted">
            <span>PRINT REQUESTS</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {metrics.totalPrintRequests}
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-amber-400">{metrics.pendingRequestsCount} Pending</span>
            <span className="text-admin-muted">•</span>
            <span className="text-blue-400">{metrics.activePrintingCount} In Print</span>
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="p-5 rounded-2xl bg-admin-card border border-admin-border space-y-2">
          <div className="flex items-center justify-between text-xs text-admin-muted">
            <span>CATALOG MODELS</span>
            <Box className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {metrics.totalProducts}
          </div>
          <span className="text-[11px] text-admin-muted block">
            {metrics.activeProducts} Active in Store
          </span>
        </div>

        {/* Card 4: Materials */}
        <div className="p-5 rounded-2xl bg-admin-card border border-admin-border space-y-2">
          <div className="flex items-center justify-between text-xs text-admin-muted">
            <span>ACTIVE MATERIALS</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {metrics.activeMaterials}
          </div>
          <Link href="/dashboard/pricing" className="text-[11px] text-blue-400 hover:underline block">
            Manage ₹/kg & Fees →
          </Link>
        </div>
      </div>

      {/* Two Column Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Print Requests */}
        <div className="p-6 rounded-2xl bg-admin-card border border-admin-border space-y-4">
          <div className="flex items-center justify-between border-b border-admin-border pb-3">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Recent Custom Print Requests</span>
            </div>
            <Link
              href="/dashboard/requests"
              className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-2.5 font-mono text-xs">
              {recentRequests.map((req: any) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{req.requestNumber}</span>
                      <span className="text-admin-muted">•</span>
                      <span className="text-admin-text truncate max-w-[140px]">{req.fileName}</span>
                    </div>
                    <div className="text-[11px] text-admin-muted">
                      {req.customerName} ({req.material})
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-bold text-white">₹{req.estimatedPrice}</span>
                    <div className="text-[10px] text-blue-400">{req.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-admin-muted font-mono text-xs">
              No print requests recorded yet.
            </div>
          )}
        </div>

        {/* Recent Store Orders */}
        <div className="p-6 rounded-2xl bg-admin-card border border-admin-border space-y-4">
          <div className="flex items-center justify-between border-b border-admin-border pb-3">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Recent Store Orders</span>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-2.5 font-mono text-xs">
              {recentOrders.map((ord: any) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-admin-surface border border-admin-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{ord.orderNumber}</span>
                      <span className="text-admin-muted">•</span>
                      <span className="text-admin-text">{ord.customerName}</span>
                    </div>
                    <div className="text-[11px] text-admin-muted">
                      {ord.items && ord.items.length > 0 ? ord.items[0]?.name : "Model"}
                      {ord.items && ord.items.length > 1 ? ` (+${ord.items.length - 1} more)` : ""}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-bold text-white">₹{ord.totalAmount}</span>
                    <div className="text-[10px] text-emerald-400">{ord.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-admin-muted font-mono text-xs">
              No store orders recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
