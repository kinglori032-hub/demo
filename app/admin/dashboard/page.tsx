"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Order } from "@/lib/types";
import { OrderRow } from "@/components/Admin/OrderRow";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("[Dashboard] Fetching orders...");
      const response = await fetch("/api/orders", {
        credentials: "include",
      });

      console.log("[Dashboard] Orders response status:", response.status);

      if (response.status === 401) {
        console.warn("[Dashboard] Unauthorized - session invalid");
        setError("Your session has expired. Please log in again.");
        setTimeout(() => router.push("/admin/login"), 2000);
        return;
      }

      const data = await response.json();
      console.log("[Dashboard] Orders data:", data);

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || "Failed to load orders");
      }
    } catch (err) {
      console.error("[Dashboard] Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log("[Dashboard] Updating order status:", orderId, "->", newStatus);
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      console.log("[Dashboard] Status update response:", response.status);

      if (response.status === 401) {
        console.warn("[Dashboard] Unauthorized - session invalid");
        toast.error("Your session has expired. Please log in again.");
        setTimeout(() => router.push("/admin/login"), 2000);
        return;
      }

      const data = await response.json();
      console.log("[Dashboard] Status update result:", data);

      if (data.success) {
        // Refresh orders
        console.log("[Dashboard] Status update successful, refreshing...");
        toast.success("Order status updated successfully");
        await fetchOrders();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("[Dashboard] Failed to update order:", err);
      toast.error("Failed to update order");
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-accent">⚙ OPERATIONS CENTER</h1>
          <Link
            href="/admin/products"
            className="btn-primary px-6 py-3"
          >
            MANAGE INVENTORY
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Orders */}
          <div className="card p-6 border-2 border-border hover:border-accent transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">TOTAL ORDERS</p>
                <p className="text-4xl font-bold text-accent">{stats.total}</p>
              </div>
              <div className="text-4xl opacity-20">📋</div>
            </div>
          </div>

          {/* Pending */}
          <div className="card p-6 border-2 border-border hover:border-status-pending transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">PENDING</p>
                <p className="text-4xl font-bold text-status-pending">{stats.pending}</p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
          </div>

          {/* Delivered */}
          <div className="card p-6 border-2 border-border hover:border-status-delivered transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">DELIVERED</p>
                <p className="text-4xl font-bold text-status-delivered">{stats.delivered}</p>
              </div>
              <div className="text-4xl opacity-20">✓</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="card p-6 border-2 border-border hover:border-accent-alt transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">REVENUE</p>
                <p className="text-4xl font-bold text-accent-alt">${stats.revenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-border bg-surface">
            <h2 className="text-2xl font-bold text-accent">RECENT ORDERS</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
              <p className="text-text-muted">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-status-cancelled bg-opacity-10 border-t border-status-cancelled">
              <p className="text-status-cancelled font-semibold">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">ORDER #</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">CUSTOMER</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">CONTACT</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">AMOUNT</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">ACTION</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">STATUS</th>
                    <th className="px-6 py-4 text-left font-semibold text-text-primary text-sm">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
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
