"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (path: string) =>
    `transition duration-200 font-medium ${
      pathname === path ? "text-accent" : "text-text-primary hover:text-accent"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled ? "bg-surface/90 backdrop-blur-md py-2" : "bg-surface py-4"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-accent hover:text-amber-500 transition"
        >
          ⚙ ARMORY
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/shop" className={linkClass("/shop")}>Catalog</Link>
          <Link href="/checkout" className={linkClass("/checkout")}>Checkout</Link>

          <Link
            href="/admin/login"
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-amber-600 transition font-semibold text-sm"
          >
            ADMIN
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-border bg-surface ${
          menuOpen ? "max-h-96 opacity-100 py-4 px-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className={linkClass("/")}>
            Home
          </Link>

          <Link href="/shop" onClick={() => setMenuOpen(false)} className={linkClass("/shop")}>
            Catalog
          </Link>

          <Link href="/checkout" onClick={() => setMenuOpen(false)} className={linkClass("/checkout")}>
            Checkout
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 bg-accent text-black rounded-lg font-semibold text-center"
          >
            ADMIN
          </Link>
        </div>
      </div>
    </header>
  );
}