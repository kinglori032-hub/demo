"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import type { Cart } from "@/lib/types";

interface CartContextType {
  cart: Cart;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  validateCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shopping_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Validate cart against actual products in the database
  const validateCart = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      
      if (!data.success || !data.data) {
        console.error("Failed to fetch products for validation");
        return;
      }

      const validProductIds = new Set(data.data.map((p: any) => p.id));
      
      setCart((prevCart) => {
        const validatedCart = { ...prevCart };
        let hasInvalidItems = false;

        for (const productId in validatedCart) {
          if (!validProductIds.has(productId)) {
            delete validatedCart[productId];
            hasInvalidItems = true;
          }
        }

        if (hasInvalidItems) {
          toast.info("Cart updated - removed unavailable products");
        }

        return validatedCart;
      });
    } catch (error) {
      console.error("Error validating cart:", error);
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        // Invalid JSON, start fresh
        setCart({});
      }
    }
    setIsHydrated(true);
  }, []);

  // Validate cart when hydrated
  useEffect(() => {
    if (isHydrated) {
      validateCart();
    }
  }, [isHydrated, validateCart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (productId: string, quantity: number) => {
    console.log(`[CartContext:addToCart] Adding to cart - ID: "${productId}" (type: ${typeof productId}), Quantity: ${quantity}`);
    setCart((prev) => {
      const updated = {
        ...prev,
        [productId]: (prev[productId] || 0) + quantity,
      };
      console.log(`[CartContext:addToCart] Updated cart:`, updated);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  const clearCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, validateCart }}>
      {isHydrated ? children : <>{children}</>}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
