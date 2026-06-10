"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductForm from "@/components/Admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();

        if (json.success) {
          setProduct(json.data);
          setError(null);
        } else {
          setError(json.error || "Failed to load product");
          toast.error("Error", {
            description: json.error || "Failed to load product",
          });
        }
      } catch (err) {
        const errorMsg = "Failed to load product";
        setError(errorMsg);
        toast.error("Error", { description: errorMsg });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Success", {
          description: "Product updated successfully",
        });
        router.push("/admin/products");
      } else {
        setError(json.error || "Update failed");
        toast.error("Error", {
          description: json.error || "Failed to update product",
        });
      }
    } catch (err) {
      const errorMsg = "Failed to update product";
      setError(errorMsg);
      toast.error("Error", { description: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/admin/products")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/products")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product details and information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {product && (
            <ProductForm
              initialData={product}
              onSubmit={handleUpdate}
              submitLabel="Update Product"
              loading={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}