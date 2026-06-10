"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-accent">📋 ORDER HISTORY</h1>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">No orders found</p>
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="card p-6 space-y-4 border-l-4 border-l-accent hover:border-l-accent-alt transition-colors"
          >
            {/* TOP INFO */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-accent">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-text-muted text-sm">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`badge-${order.status} px-4 py-2`}>
                {order.status.toUpperCase()}
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-surface p-4 rounded-lg space-y-2">
              <h3 className="font-bold text-accent text-sm mb-3">CUSTOMER DETAILS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="text-text-muted">Name:</span> <span className="text-text-primary">{order.customerName}</span></p>
                <p><span className="text-text-muted">Phone:</span> <span className="text-text-primary">{order.phone}</span></p>
                <p><span className="text-text-muted">Email:</span> <span className="text-text-primary">{order.email || "-"}</span></p>
                <p><span className="text-text-muted">City:</span> <span className="text-text-primary">{order.city}</span></p>
                <p className="col-span-2"><span className="text-text-muted">Address:</span> <span className="text-text-primary">{order.address}</span></p>
                {order.notes && (
                  <p className="col-span-2"><span className="text-text-muted">Notes:</span> <span className="text-text-primary">{order.notes}</span></p>
                )}
              </div>
            </div>

            {/* ITEMS */}
            <div>
              <h3 className="font-bold text-accent text-sm mb-3">ITEMS ORDERED</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-surface p-3 rounded-lg border border-border hover:border-accent transition-colors"
                  >
                    <span className="text-text-primary">
                      {item.product?.name} <span className="text-text-muted">×{item.quantity}</span>
                    </span>
                    <span className="text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center pt-4 border-t border-border bg-gradient-to-r from-surface to-card p-4 rounded-lg">
              <span className="text-text-primary font-bold">TOTAL:</span>
              <span className="text-2xl font-bold text-accent">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}