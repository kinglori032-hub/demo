"use client";

import { Suspense } from "react";
import Link from "next/link";
import OrderConfirmationContent from "./order-confirmation-content";

function OrderConfirmationFallback() {
  return (
    <div className="min-h-screen bg-primary px-4 py-12 flex items-center justify-center">
      <div className="card p-8 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted">Loading order confirmation...</p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
