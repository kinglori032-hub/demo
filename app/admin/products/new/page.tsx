"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/Admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    setLoading(false);

    if (json.success) {
      router.push("/admin/products");
    } else {
      alert(json.error || "Create failed");
    }
  };

  return (
    <ProductForm
      onSubmit={handleCreate}
      loading={loading}
      submitLabel="Create Product"
    />
  );
}