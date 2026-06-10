"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/components/Cart/CartContext";
import type { Product, CheckoutFormData, CreateOrderRequest } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });

  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products[productId];
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  useEffect(() => {
    if (itemCount === 0) {
      router.push("/shop");
      return;
    }

    async function fetchProducts() {
      try {
        console.log("[Checkout] Fetching products for validation. Cart items:", Object.keys(cart));
        const response = await fetch("/api/products");
        const data = await response.json();
        
        console.log("[Checkout] API Response - Success:", data.success);
        console.log("[Checkout] API returned products count:", data.data?.length || 0);
        console.log("[Checkout] API returned product IDs:", data.data?.map((p: Product) => p.id) || []);
        console.log("[Checkout] Cart product IDs:", Object.keys(cart));
        
        if (data.success) {
          const productMap: { [key: string]: Product } = {};
          data.data.forEach((product: Product) => {
            productMap[product.id] = product;
          });
          
          // Log any missing products
          const missingProducts = Object.keys(cart).filter(id => !productMap[id]);
          if (missingProducts.length > 0) {
            console.warn("[Checkout] Missing products in API response:", missingProducts);
            missingProducts.forEach(id => {
              console.warn(`  - Product ID: "${id}" (type: ${typeof id})`);
            });
          }
          
          setProducts(productMap);
        } else {
          console.error("[Checkout] API response not successful:", data);
        }
      } catch (err) {
        console.error("[Checkout] Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [itemCount, router, cart]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate that all cart items are still in stock
  const validateCartStock = (): boolean => {
    console.log("[Checkout:validateCartStock] Starting validation");
    console.log("[Checkout:validateCartStock] Cart contents:", cart);
    console.log("[Checkout:validateCartStock] Available products:", Object.keys(products));
    
    for (const [productId, quantity] of Object.entries(cart)) {
      const product = products[productId];
      
      console.log(`[Checkout:validateCartStock] Checking product ID: "${productId}"`);
      console.log(`[Checkout:validateCartStock]   - Cart quantity: ${quantity}`);
      console.log(`[Checkout:validateCartStock]   - Product found: ${!!product}`);
      
      if (!product) {
        console.error(`[Checkout:validateCartStock] Product not found: ${productId}`);
        toast.error("Product no longer available", {
          description: "One or more products have been removed from our store.",
        });
        return false;
      }
      
      console.log(`[Checkout:validateCartStock]   - Product name: ${product.name}`);
      console.log(`[Checkout:validateCartStock]   - Available stock: ${product.stock}`);
      
      if (product.stock < quantity) {
        console.warn(`[Checkout:validateCartStock] Insufficient stock for ${product.name}`);
        toast.warning("Insufficient stock", {
          description: `${product.name} only has ${product.stock} unit${product.stock === 1 ? "" : "s"} available, but you have ${quantity} in your cart.`,
        });
        return false;
      }
    }
    
    console.log("[Checkout:validateCartStock] All validations passed");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.customerName ||
        !formData.phone ||
        !formData.city ||
        !formData.address
      ) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate phone - must be 10-15 digits, optional + prefix (matches backend schema)
      if (!/^\+?\d{10,15}$/.test(formData.phone)) {
        setError("Please enter a valid phone number (10-15 digits, optional + prefix)");
        setIsSubmitting(false);
        return;
      }

      // Validate stock before submitting order
      if (!validateCartStock()) {
        setIsSubmitting(false);
        return;
      }

      const orderData: CreateOrderRequest = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || null,
        city: formData.city,
        address: formData.address,
        notes: formData.notes || null,
        items: Object.entries(cart).map(([productId, quantity]) => ({
          productId,
          quantity: Number(quantity),
        })),
      };

      console.log("[Checkout] Submitting order data:", JSON.stringify(orderData, null, 2));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.error || "Failed to place order";
        setError(errorMessage);
        
        // Show specific error types
        if (errorMessage.includes("must be") || errorMessage.includes("cannot be") || errorMessage.includes("is required")) {
          toast.error("Please fix the following issues:", {
            description: errorMessage,
          });
        } else if (errorMessage.includes("Insufficient stock")) {
          toast.error("Stock unavailable", {
            description: errorMessage,
          });
        } else if (errorMessage.includes("not found")) {
          toast.error("Product unavailable", {
            description: errorMessage,
          });
        } else if (errorMessage.includes("Cart cannot be empty")) {
          toast.error("Empty cart", {
            description: "Please add items to your cart before checkout.",
          });
        } else {
          toast.error("Order failed", {
            description: errorMessage,
          });
        }
        
        setIsSubmitting(false);
        return;
      }

      // Success - show toast and clear cart
      toast.success("Order placed successfully!", {
        description: `Order #${data.data.orderNumber} has been created.`,
      });
      clearCart();
      router.push(`/order-confirmation?orderNumber=${data.data.orderNumber}`);
    } catch (err) {
      console.error("Order submission error:", err);
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error("Checkout error", {
        description: errorMsg,
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-primary px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-accent">🛍️ SECURE CHECKOUT</h1>

        {error && (
          <div className="bg-status-cancelled bg-opacity-10 border-2 border-status-cancelled text-status-cancelled px-6 py-4 rounded-lg mb-6 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <h2 className="text-2xl font-bold text-accent mb-6">
                📬 DELIVERY INFORMATION
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block font-semibold text-text-primary mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-2">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1234567890"
                  />
                  <p className="text-xs text-text-muted mt-1">Format: 10-15 digits, optional + prefix</p>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-2">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-2">CITY *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-2">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-2">
                    DELIVERY NOTES
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="bg-surface border-l-4 border-l-accent-alt p-4 rounded">
                  <p className="text-sm text-text-primary font-semibold">
                    💳 PAYMENT METHOD: <span className="text-accent-alt">CASH ON DELIVERY</span>
                  </p>
                  <p className="text-sm text-text-muted mt-2">
                    Please have exact change ready for the delivery personnel.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg font-bold mt-6"
              >
                {isSubmitting ? "⏳ PROCESSING..." : "✓ PLACE ORDER"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-accent pb-4 border-b border-border">
                📋 ORDER SUMMARY
              </h2>

              <div className="space-y-3 pb-4 border-b border-border max-h-64 overflow-y-auto">
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products[productId];
                  if (!product) return null;

                  return (
                    <div
                      key={productId}
                      className="flex justify-between items-start gap-3 p-2 bg-surface rounded hover:bg-card transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">{product.name}</p>
                        <p className="text-xs text-text-muted">qty: {quantity}</p>
                      </div>
                      <p className="font-bold text-accent whitespace-nowrap">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted text-sm">
                  <span>🚚 Delivery:</span>
                  <span className="text-status-delivered">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t border-border bg-surface p-3 rounded">
                  <span className="text-text-primary">TOTAL:</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
