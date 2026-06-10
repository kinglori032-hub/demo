"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-primary px-4 py-12">
      <div className="max-w-md mx-auto card p-8 text-center space-y-6 border-2 border-status-delivered">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-status-delivered bg-opacity-20 border-2 border-status-delivered">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-status-delivered">
          ORDER CONFIRMED!
        </h1>

        {/* Order Number */}
        {orderNumber && (
          <div className="bg-surface border-l-4 border-l-accent rounded p-6">
            <p className="text-text-muted text-sm mb-2">ORDER NUMBER</p>
            <p className="text-3xl font-bold text-accent">#{orderNumber}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-3 text-left bg-surface rounded-lg p-6 border border-border">
          <h2 className="font-bold text-accent mb-4 flex items-center gap-2">
            <span>📋</span> WHAT HAPPENS NEXT?
          </h2>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex items-start gap-3">
              <span className="text-status-delivered mt-0.5">✓</span>
              <span>Your order has been <span className="text-status-delivered font-semibold">received and confirmed</span></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-status-delivered mt-0.5">✓</span>
              <span>Our team will <span className="text-accent font-semibold">contact you shortly</span> to confirm delivery details</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-status-delivered mt-0.5">✓</span>
              <span>Delivery will be arranged <span className="text-accent-alt font-semibold">within 2-3 business days</span></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-status-delivered mt-0.5">✓</span>
              <span>Please have <span className="text-accent font-semibold">exact change ready</span> for cash payment</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Link
            href="/shop"
            className="block btn-primary py-3 font-bold text-center"
          >
            🛍️ CONTINUE SHOPPING
          </Link>
          <Link
            href="/"
            className="block btn-ghost py-3 font-bold text-center hover:bg-card"
          >
            🏠 BACK TO HOME
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-xs text-text-muted pt-4 border-t border-border">
          <p>Questions? Contact our team anytime.</p>
        </div>
      </div>
    </div>
  );
}
