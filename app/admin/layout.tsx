"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/admin/login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - Only show if not on login page */}
      {!isLoginPage && (
        <aside className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-72 bg-surface border-r border-border text-white p-6 fixed md:relative top-0 left-0 z-50 md:z-0 md:h-auto h-screen overflow-y-auto`}>
          <div className="flex justify-between items-center mb-8">
            <Link href="/admin/dashboard" className="text-2xl font-bold inline-block text-accent hover:text-amber-400 transition">
              ⚙ ARMORY ADMIN
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-text-primary text-2xl hover:text-accent"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="block btn-primary w-full text-left"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/orders"
              onClick={() => setSidebarOpen(false)}
              className="block btn-ghost w-full text-left hover:bg-card"
            >
              📋 Orders
            </Link>
            <Link
              href="/admin/products"
              onClick={() => setSidebarOpen(false)}
              className="block btn-ghost w-full text-left hover:bg-card"
            >
              📦 Products
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left btn-danger"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-primary overflow-auto w-full min-h-screen">
        {/* Mobile Menu Button - Only show if not on login page */}
        {!isLoginPage && (
          <div className="md:hidden bg-surface border-b border-border text-white p-4 flex justify-between items-center sticky top-0 z-40">
            <h1 className="text-lg font-bold text-accent">⚙ ARMORY ADMIN</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-accent text-2xl hover:text-amber-400"
              aria-label="Open sidebar"
            >
              ☰
            </button>
          </div>
        )}
        
        <div className="p-4 md:p-0">{children}</div>
      </main>

      {/* Mobile Sidebar Overlay - Only show if not on login page */}
      {!isLoginPage && sidebarOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black bg-opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
