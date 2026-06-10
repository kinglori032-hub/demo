"use client";

import { useEffect, useState } from "react";

type ProductFormData = {
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

type Props = {
  initialData?: ProductFormData | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
};

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}: Props) {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    image: "",
    stock: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "stock") {
      setForm({
        ...form,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const imageUrl = data.url || data.data;

      setForm({ ...form, image: imageUrl });
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: ProductFormData = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      stock: Number(form.stock),
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {/* Image Preview Section */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-bold text-accent">PRODUCT IMAGE</h3>
        <div className="flex gap-6 items-start flex-col md:flex-row">
          {/* Image Preview */}
          {imagePreview && (
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-40 h-40 object-cover rounded-lg border-2 border-accent border-opacity-30"
              />
            </div>
          )}
          
          {/* Upload Area */}
          <div className="flex-1 w-full">
            <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-surface hover:bg-opacity-50 transition-all duration-300">
              <div className="text-center">
                <svg
                  className="mx-auto h-10 w-10 text-text-muted mb-3"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-8l-6-6m0 0l-6 6m6-6v16"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-text-muted">
                  {uploadLoading ? "⏳ UPLOADING..." : "📸 CLICK TO UPLOAD"}
                </p>
                <p className="text-xs text-text-muted mt-1">PNG, JPG, or WEBP</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadLoading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-accent">PRODUCT DETAILS</h3>
        
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            PRODUCT NAME *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            DESCRIPTION *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={5}
            className="w-full resize-none"
            required
          />
        </div>

        {/* Price and Stock Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              PRICE ($) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              STOCK QTY *
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || uploadLoading}
        className="w-full btn-primary py-3 text-lg font-bold"
      >
        {loading ? "⏳ PROCESSING..." : `✓ ${submitLabel.toUpperCase()}`}
      </button>
    </form>
  );
}