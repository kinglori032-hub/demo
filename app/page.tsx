"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
          setFeaturedProducts(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-surface via-card to-primary text-white py-24 px-4 border-b-2 border-border relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-alt rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-4">⚙</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-accent">
            TACTICAL ARMORY
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text-muted max-w-2xl mx-auto">
            Premium shooting range equipment & tactical accessories. Built for professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="btn-primary px-8 py-3 text-lg font-bold"
            >
              🛒 BROWSE CATALOG
            </Link>
            <Link
              href="/admin/login"
              className="btn-secondary px-8 py-3 text-lg font-bold"
            >
              🔧 ADMIN PANEL
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-accent mb-3">
            📦 FEATURED EQUIPMENT
          </h2>
          <p className="text-text-muted">Hand-selected premium items</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-text-muted">Loading products...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted mb-4 text-lg">No products available yet</p>
            <p className="text-text-muted text-sm">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="card overflow-hidden hover:border-accent transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative w-full h-56 bg-surface overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-text-primary group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-sm line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-2xl font-bold text-accent">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      product.stock > 10 
                        ? 'badge-delivered' 
                        : product.stock > 0 
                        ? 'badge-pending' 
                        : 'badge-cancelled'
                    }`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block btn-primary px-10 py-4 text-lg font-bold"
          >
            ➜ VIEW FULL CATALOG
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-surface border-t border-b border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-lg font-bold text-accent mb-2">Fast Delivery</h3>
              <p className="text-text-muted">Quick and reliable shipping within 2-3 business days</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-accent mb-2">Best Prices</h3>
              <p className="text-text-muted">Competitive pricing on all tactical equipment</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-accent mb-2">Secure & Safe</h3>
              <p className="text-text-muted">Cash on delivery with verified orders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
