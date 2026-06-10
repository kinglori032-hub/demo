import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - ShopHub | Browse Our Products",
  description: "Browse our premium collection of products. Find high-quality items with competitive prices and fast shipping.",
  openGraph: {
    title: "Shop - ShopHub | Browse Our Products",
    description: "Browse our premium collection of products. Find high-quality items with competitive prices and fast shipping.",
    url: "https://shophub.com/shop",
    type: "website",
    images: [
      {
        url: "/og-shop.jpg",
        width: 1200,
        height: 630,
        alt: "ShopHub Shop Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop - ShopHub | Browse Our Products",
    description: "Browse our premium collection of products. Find high-quality items with competitive prices and fast shipping.",
    images: ["/og-shop.jpg"],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
