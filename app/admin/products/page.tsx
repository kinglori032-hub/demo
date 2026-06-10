"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { ProductRow } from "@/components/Admin/ProductRow";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("[Products] Fetching products...");
      const response = await fetch("/api/products", {
        credentials: "include",
      });

      console.log("[Products] Response status:", response.status);

      if (response.status === 401) {
        console.warn("[Products] Unauthorized - session invalid");
        toast.error("Your session has expired. Please log in again.");
        setTimeout(() => router.push("/admin/login"), 2000);
        return;
      }

      const data = await response.json();
      console.log("[Products] Data:", data);

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch (err) {
      console.error("[Products] Failed to fetch products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      console.log("[Products] Deleting product:", productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("[Products] Delete response status:", response.status);

      if (response.status === 401) {
        console.warn("[Products] Unauthorized - session invalid");
        toast.error("Your session has expired. Please log in again.");
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      console.log("[Products] Delete response:", data);

      if (data.success) {
        console.log("[Products] Delete successful, refreshing...");
        toast.success("Product deleted successfully");
        await fetchProducts();
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch (err) {
      console.error("[Products] Failed to delete product:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-accent">📦 INVENTORY MANAGEMENT</h1>
          <Link
            href="/admin/products/new"
            className="btn-primary px-6 py-3"
          >
            ➕ ADD PRODUCT
          </Link>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
              <p className="text-text-muted">Loading inventory...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-status-cancelled bg-opacity-10 border border-status-cancelled rounded">
              <p className="text-status-cancelled font-semibold">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted mb-4">No products in inventory</p>
              <Link
                href="/admin/products/new"
                className="inline-block btn-primary px-6 py-2"
              >
                ➕ ADD FIRST PRODUCT
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">NAME</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">DESCRIPTION</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">PRICE</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">STOCK</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">CREATED</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
