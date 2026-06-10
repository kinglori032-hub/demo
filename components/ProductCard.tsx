"use client";

import { useCart } from "@/components/Cart/CartContext";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log(`[ProductCard:handleAddToCart] Product ID: "${product.id}" (type: ${typeof product.id})`);
    console.log(`[ProductCard:handleAddToCart] Product: ${product.name}, Stock: ${product.stock}`);
    
    // Check if product is in stock
    if (product.stock <= 0) {
      toast.error("Out of stock", {
        description: `${product.name} is currently unavailable.`,
      });
      return;
    }

    // Check if requesting more than available
    if (1 > product.stock) {
      toast.warning("Stock limit reached", {
        description: `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} are currently available.`,
      });
      return;
    }

    addToCart(product.id, 1);
    console.log(`[ProductCard:handleAddToCart] Successfully added to cart`);
    toast.success("Added to cart", {
      description: `${product.name} added to your cart.`,
    });
  };

  return (
    <div className="card overflow-hidden hover:border-accent transition-all duration-300 group cursor-pointer h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-56 bg-surface overflow-hidden">
        <img
          src={product.image}
          alt={`${product.name} - ${product.description.substring(0, 50)}`}
          title={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 text-accent group-hover:text-amber-400 transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-text-muted text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        {/* Stock Status */}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-delivered"></div>
          <span className="text-xs text-text-muted">
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `${product.stock} available` : "Out of Stock"}
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
          <span className="text-2xl font-bold text-accent">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary text-sm px-4 py-2"
          >
            {product.stock > 0 ? "ACQUIRE" : "UNAVAILABLE"}
          </button>
        </div>

        {product.stock < 5 && product.stock > 0 && (
          <p className="text-xs text-status-pending mt-3 flex items-center gap-1">
            ⚠ Limited: {product.stock} unit{product.stock !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
