import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation - ShopHub",
  description: "Your order has been confirmed. Track your order and view details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
