"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";

interface OrderRowProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
}

const STATUSES = ["pending", "confirmed", "processing", "delivered", "cancelled"];

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "badge-pending";
    case "confirmed":
      return "badge-confirmed";
    case "processing":
      return "badge-processing";
    case "delivered":
      return "badge-delivered";
    case "cancelled":
      return "badge-cancelled";
    default:
      return "badge-pending";
  }
};

export function OrderRow({ order, onStatusChange }: OrderRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="border-b border-border hover:bg-card hover:bg-opacity-50 transition-colors duration-200">
      <td className="px-4 py-4 font-semibold text-accent">{order.orderNumber}</td>
      <td className="px-4 py-4 text-text-primary">{order.customerName}</td>
      <td className="px-4 py-4 text-text-primary text-sm font-mono">{order.phone}</td>
      <td className="px-4 py-4 text-accent font-semibold">${order.total.toFixed(2)}</td>
      <td className="px-4 py-4">
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className={`px-3 py-1.5 border border-border rounded bg-card text-text-primary capitalize cursor-pointer transition-all ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent'}`}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status} className="bg-card text-text-primary">
              {status}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-4">
        <span className={statusBadgeClass(order.status)}>
          {order.status}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-text-muted">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}
