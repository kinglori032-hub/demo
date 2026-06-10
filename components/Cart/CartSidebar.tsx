"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/components/Cart/CartContext";
import type { Product } from "@/lib/types";

export function CartSidebar() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      setIsLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
          const productMap: { [key: string]: Product } = {};
          data.data.forEach((product: Product) => {
            productMap[product.id] = product;
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [cart]);

  const total = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products[productId];
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleRemoveFromCart = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.error(`${productName} removed from cart`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, product: Product) => {
    // Validate quantity against stock
    if (newQuantity > product.stock) {
      toast.warning("Stock limit reached", {
        description: `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} available.`,
      });
      // Don't update, just return
      return;
    }

    updateQuantity(productId, newQuantity);
    if (newQuantity > 0) {
      toast.success(`Quantity updated to ${newQuantity}`);
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin mb-3"></div>
        <p className="text-text-muted">Loading cart...</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="card p-6 text-center space-y-4">
        <p className="text-2xl">🛒</p>
        <p className="text-text-muted mb-4">Your cart is empty</p>
        <Link href="/shop" className="inline-block btn-primary px-6 py-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <h2 className="text-lg font-bold text-accent">🛒 CART</h2>
        <span className="badge badge-pending">{itemCount} items</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {Object.entries(cart).map(([productId, quantity]) => {
          const product = products[productId];
          if (!product) return null;

          return (
            <div
              key={productId}
              className="p-3 bg-surface rounded-lg border border-border hover:border-accent transition-colors space-y-2"
            >
              <p className="font-semibold text-text-primary text-sm">{product.name}</p>
              <p className="text-xs text-text-muted">
                ${product.price.toFixed(2)} × {quantity} = <span className="text-accent">${(product.price * quantity).toFixed(2)}</span>
              </p>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(productId, parseInt(e.target.value), product)
                  }
                  className="flex-1 w-full text-sm"
                />
                <button
                  onClick={() => handleRemoveFromCart(productId, product.name)}
                  className="btn-danger px-2 py-1 text-sm flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between items-center bg-surface p-3 rounded-lg">
          <span className="text-text-muted">Subtotal:</span>
          <span className="text-2xl font-bold text-accent">
            ${total.toFixed(2)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full btn-primary py-3 text-center font-bold"
        >
          ➜ CHECKOUT
        </Link>
      </div>
    </div>
  );
}
