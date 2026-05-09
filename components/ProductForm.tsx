"use client";

import { useState, useCallback } from "react";
import { X, Upload, ChevronLeft } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { VariantManager } from "./VariantManager";
import { Card, CardContent } from "./Card";
import type { Product, ProductVariant } from "@/lib/types";

const CATEGORIES = [
  { value: "vegetables", label: "🥬 Vegetables" },
  { value: "fruits", label: "🍎 Fruits" },
  { value: "grains", label: "🌾 Grains & Pulses" },
  { value: "spices", label: "🌶️ Spices" },
  { value: "dairy", label: "🥛 Dairy" },
  { value: "oils", label: "🛢️ Oils & Ghee" },
  { value: "dry_fruits", label: "🥜 Dry Fruits" },
  { value: "other", label: "📦 Other" },
];

interface ProductFormProps {
  product?: Partial<Product>;
  initialVariants?: Partial<ProductVariant>[];
  onSubmit: (product: Partial<Product>, variants: Partial<ProductVariant>[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  initialVariants = [],
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || "",
    category: product?.category || "",
    is_active: product?.is_active ?? true,
  });
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(initialVariants);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (variants.length === 0) {
      newErrors.variants = "Add at least one unit/price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const productData: Partial<Product> = {
      ...formData,
      image: imagePreview || undefined,
    };

    onSubmit(productData, variants);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Image Upload */}
        <Card>
          <CardContent className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Photo
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-emerald-400 transition-all">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-base font-medium text-gray-600">
                    Tap to add photo
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    Optional but recommended
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Desi Aloo, Basmati Rice, etc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

            <Select
              label="Category"
              placeholder="Select category"
              options={CATEGORIES}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={errors.category}
            />
          </CardContent>
        </Card>

        {/* Variants Section */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Units & Pricing
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Add different pack sizes with their prices. Customers can choose what works for them.
            </p>

            {errors.variants && (
              <p className="text-sm text-red-600 font-medium mb-4">{errors.variants}</p>
            )}

            <VariantManager variants={variants} onChange={setVariants} />
          </CardContent>
        </Card>

        {/* Smart Pricing Insights */}
        {variants.length > 1 && (
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <h3 className="font-bold text-emerald-800 mb-2">💡 Pricing Tip</h3>
              <p className="text-sm text-emerald-700">
                You have {variants.length} different units. The system will automatically
                show customers which option gives the best per-kg price.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:relative sm:bg-transparent sm:border-0 sm:p-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1"
              size="touch"
            >
              {product ? "Save Changes" : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              size="touch"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
