import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - ShopHub | Complete Your Purchase",
  description: "Secure checkout at ShopHub. Review your order and complete your purchase safely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
