"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-bold text-accent hover:text-amber-500 transition duration-200 tracking-wide"
          aria-label="ShopHub Home"
        >
          ⚙ ARMORY
        </Link>
        <nav className="flex items-center gap-8" aria-label="Main Navigation">
          <Link 
            href="/" 
            className="text-text-primary hover:text-accent transition duration-200 font-medium"
            aria-current="page"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            className="text-text-primary hover:text-accent transition duration-200 font-medium"
            aria-label="Browse all products"
          >
            Catalog
          </Link>
          <Link 
            href="/checkout" 
            className="text-text-primary hover:text-accent transition duration-200 font-medium"
            aria-label="View shopping cart and checkout"
          >
            Checkout
          </Link>
          <Link 
            href="/admin/login" 
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-amber-600 transition duration-200 font-semibold text-sm"
            aria-label="Admin panel"
          >
            ADMIN
          </Link>
        </nav>
      </div>
    </header>
  );
}
