"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Successfully logged in
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-alt rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="card p-8 w-full max-w-md relative z-10 border-2 border-border hover:border-accent transition-colors">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-accent mb-2">
            ARMORY ACCESS
          </h1>
          <p className="text-text-muted text-sm">
            Admin Operations Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-status-cancelled bg-opacity-10 border-l-4 border-l-status-cancelled text-status-cancelled px-4 py-3 rounded mb-6 text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold text-text-primary mb-3 text-sm">
              🔑 MASTER PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 font-bold text-lg"
          >
            {isLoading ? "⏳ VERIFYING..." : "✓ AUTHENTICATE"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-text-muted text-xs">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <Link href="/" className="text-accent-alt hover:text-accent transition text-sm font-semibold">
            ← Return to Shop
          </Link>
        </div>

        {/* Demo Info */}
        <div className="mt-8 pt-6 border-t border-border bg-surface rounded-lg p-4 text-xs">
          <p className="text-accent font-bold mb-2">🧪 DEMO ACCESS</p>
          <p className="text-text-muted">
            Password: <code className="bg-card px-2 py-1 rounded text-accent-alt font-mono">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
