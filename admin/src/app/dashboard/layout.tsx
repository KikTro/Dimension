"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  Layers,
  DollarSign,
  FileText,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Database,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: "Products", href: "/dashboard/products", icon: Box },
    { name: "Materials", href: "/dashboard/materials", icon: Layers },
    { name: "Pricing Rules", href: "/dashboard/pricing", icon: DollarSign },
    { name: "Print Requests", href: "/dashboard/requests", icon: FileText },
    { name: "Store Orders", href: "/dashboard/orders", icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-admin-card border-b border-admin-border z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs font-mono">
            D
          </div>
          <span className="font-mono text-sm font-semibold tracking-wider text-white">
            OPERATIONS
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-admin-surface text-admin-text"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-admin-card border-r border-admin-border flex flex-col justify-between p-4 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="px-2 pt-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold font-mono text-sm shadow-md">
              D
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-white tracking-wide block">
                DIMENSION
              </span>
              <span className="font-mono text-[10px] text-admin-muted">
                OPERATIONS CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-mono text-admin-muted/80 uppercase tracking-widest block mb-2">
              MANAGEMENT
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl font-mono text-xs transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-admin-muted hover:text-white hover:bg-admin-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-admin-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between px-2 text-[11px] text-admin-muted">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>SQLITE DB</span>
            </span>
            <span className="text-admin-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-admin-success" />
              CONNECTED
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-admin-surface hover:bg-red-950/40 hover:text-red-400 text-admin-muted transition-colors border border-admin-border text-[11px]"
          >
            <span>End Session</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
