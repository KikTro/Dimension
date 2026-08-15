"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, ArrowRight, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed. Please verify your passcode.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Network error communicating with authentication service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-admin-card border border-admin-border rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white font-mono tracking-tight">
            DIMENSION OPERATIONS
          </h1>
          <p className="text-xs text-admin-muted font-sans">
            Private Administration & Additive Manufacturing Management
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-admin-text block">ENTER MASTER PASSCODE</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-admin-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-admin-surface border border-admin-border text-white placeholder-admin-muted/60 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <span className="text-[10px] text-admin-muted block pt-1">
              Default Development Key: <code className="text-admin-text bg-admin-surface px-1.5 py-0.5 rounded">dimension2026</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
          >
            <span>{isLoading ? "AUTHENTICATING..." : "ACCESS CONTROL CONSOLE"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
