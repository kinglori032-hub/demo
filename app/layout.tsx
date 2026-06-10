import type { Metadata } from "next";
import { CartProvider } from "@/components/Cart/CartContext";
import { ToastProvider } from "@/components/ToastProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ShopHub - Your Trusted Online Store",
  description: "Premium e-commerce platform for quality products and fast shipping",
  metadataBase: new URL("https://shophub.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shophub.com",
    title: "ShopHub - Your Trusted Online Store",
    description: "Premium e-commerce platform for quality products and fast shipping",
    siteName: "ShopHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShopHub - Your Trusted Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Your Trusted Online Store",
    description: "Premium e-commerce platform for quality products and fast shipping",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shophub.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShopHub",
    url: "https://shophub.com",
    description: "Premium e-commerce platform for quality products and fast shipping",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+1-800-SHOPHUB",
      email: "support@shophub.com",
    },
    sameAs: [
      "https://facebook.com/shophub",
      "https://twitter.com/shophub",
      "https://instagram.com/shophub",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>
        <ToastProvider />
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
