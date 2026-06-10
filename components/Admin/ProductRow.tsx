"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const stockClass = 
    product.stock > 10 
      ? "bg-status-delivered bg-opacity-20 text-status-delivered border border-status-delivered border-opacity-30"
      : product.stock > 0
        ? "bg-status-pending bg-opacity-20 text-status-pending border border-status-pending border-opacity-30"
        : "bg-status-cancelled bg-opacity-20 text-status-cancelled border border-status-cancelled border-opacity-30";

  return (
    <tr className="border-b border-border hover:bg-card hover:bg-opacity-50 transition-colors duration-200">
      <td className="px-4 py-4 font-semibold text-accent">{product.name}</td>
      <td className="px-4 py-4 text-sm text-text-muted line-clamp-1">
        {product.description}
      </td>
      <td className="px-4 py-4 font-semibold text-accent">${product.price.toFixed(2)}</td>
      <td className="px-4 py-4">
        <span className={`px-2.5 py-1 rounded text-sm font-semibold ${stockClass}`}>
          {product.stock} units
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-text-muted">
        {new Date(product.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 space-x-2 flex">
        <button
          onClick={() => onEdit(product)}
          className="btn-secondary text-sm px-3 py-1.5"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn-danger text-sm px-3 py-1.5"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
