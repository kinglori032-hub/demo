"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CartSidebar } from "@/components/Cart/CartSidebar";
import type { Product } from "@/lib/types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("[Shop:fetchProducts] Starting fetch");
        const response = await fetch("/api/products");
        console.log("[Shop:fetchProducts] Got response, status:", response.status);
        const data = await response.json();
        console.log("[Shop:fetchProducts] Parsed JSON:", data);

        if (data.success) {
          console.log("[Shop:fetchProducts] Success! Setting products count:", data.data.length);
          setProducts(data.data);
        } else {
          console.error("[Shop:fetchProducts] API returned error:", data.error);
          setError(data.error || "Failed to load products");
        }
      } catch (err) {
        console.error("[Shop:fetchProducts] Catch block - error:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        console.log("[Shop:fetchProducts] Finally block - setting isLoading to false");
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-accent mb-2">EQUIPMENT CATALOG</h1>
          <p className="text-text-muted text-lg">Premium tactical equipment and accessories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
                <p className="text-text-muted text-lg">Loading inventory...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-status-cancelled bg-opacity-10 rounded-lg border border-status-cancelled">
                <p className="text-status-cancelled font-semibold text-lg">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-text-muted text-xl">No products available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
