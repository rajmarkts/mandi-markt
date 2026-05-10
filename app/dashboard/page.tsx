"use client";

import { useState, useMemo } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Plus, Search, Filter, Package, Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import type { Product, ProductVariant, ProductWithVariants } from "@/lib/types";

// Mock data for demonstration
const MOCK_PRODUCTS: ProductWithVariants[] = [
  {
    id: "1",
    name: "Desi Aloo (Potatoes)",
    category: "vegetables",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v1", product: "1", unit_name: "1kg", unit_weight_kg: 1, price: 25, stock_quantity: 100, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v2", product: "1", unit_name: "5kg", unit_weight_kg: 5, price: 110, stock_quantity: 50, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v3", product: "1", unit_name: "50kg Bora", unit_weight_kg: 50, price: 900, stock_quantity: 20, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
  {
    id: "2",
    name: "Basmati Rice Premium",
    category: "grains",
    image: "",
    wholesaler: "wh1",
    is_active: true,
    created: "2024-01-01",
    updated: "2024-01-01",
    variants: [
      { id: "v4", product: "2", unit_name: "1kg", unit_weight_kg: 1, price: 120, stock_quantity: 200, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v5", product: "2", unit_name: "5kg", unit_weight_kg: 5, price: 550, stock_quantity: 100, is_available: true, min_order_quantity: 1, created: "", updated: "" },
      { id: "v6", product: "2", unit_name: "30kg", unit_weight_kg: 30, price: 3000, stock_quantity: 30, is_available: true, min_order_quantity: 1, created: "", updated: "" },
    ],
  },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const userRole = user?.unsafeMetadata?.role as string | undefined;
  
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [products, setProducts] = useState<ProductWithVariants[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductWithVariants | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithVariants | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAdd = async (
    productData: Partial<Product>,
    variants: Partial<ProductVariant>[]
  ) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProduct: ProductWithVariants = {
      id: Math.random().toString(36).substr(2, 9),
      name: productData.name || "",
      category: productData.category || "",
      image: productData.image as string || "",
      wholesaler: "wh1",
      is_active: true,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      variants: variants.map((v, i) => ({
        id: `v${Date.now()}${i}`,
        product: "",
        unit_name: v.unit_name || "",
        unit_weight_kg: v.unit_weight_kg || null,
        price: v.price || 0,
        stock_quantity: v.stock_quantity || 0,
        is_available: true,
        min_order_quantity: v.min_order_quantity || 1,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      })),
    };

    setProducts([newProduct, ...products]);
    setView("list");
    setIsLoading(false);
  };

  const handleEdit = async (
    productData: Partial<Product>,
    variants: Partial<ProductVariant>[]
  ) => {
    if (!editingProduct) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedProducts: ProductWithVariants[] = products.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            name: productData.name || p.name,
            category: productData.category || p.category,
            image: (productData.image as string) || p.image,
            updated: new Date().toISOString(),
            variants: variants.map((v, i): ProductVariant => ({
              id: v.id || `v${Date.now()}${i}`,
              product: p.id,
              unit_name: v.unit_name || "",
              unit_weight_kg: v.unit_weight_kg || null,
              price: v.price || 0,
              stock_quantity: v.stock_quantity || 0,
              is_available: v.is_available ?? true,
              min_order_quantity: v.min_order_quantity || 1,
              created: v.created || new Date().toISOString(),
              updated: new Date().toISOString(),
            })),
          }
        : p
    );

    setProducts(updatedProducts as typeof products);
    setView("list");
    setEditingProduct(null);
    setIsLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setProducts(products.filter((p) => p.id !== deletingProduct.id));
    setDeletingProduct(null);
    setIsLoading(false);
  };

  // Edit view
  if (view === "edit" && editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        initialVariants={editingProduct.variants || []}
        onSubmit={handleEdit}
        onCancel={() => {
          setView("list");
          setEditingProduct(null);
        }}
        isLoading={isLoading}
      />
    );
  }

  // Add view
  if (view === "add") {
    return (
      <ProductForm
        onSubmit={handleAdd}
        onCancel={() => setView("list")}
        isLoading={isLoading}
      />
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {/* User Profile Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold">
            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">
              {userRole || "Wholesaler"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="text-gray-500 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-navy text-white rounded-xl p-4">
          <p className="text-blue-200 text-sm">Total Products</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Active Variants</p>
          <p className="text-3xl font-bold text-gray-900">
            {products.reduce((sum, p) => sum + p.variants.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hidden sm:block">
          <p className="text-gray-500 text-sm">Categories</p>
          <p className="text-3xl font-bold text-gray-900">
            {new Set(products.map((p) => p.category)).size}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
          />
        </div>
        <button className="h-14 px-4 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Add Button */}
      <Button
        onClick={() => setView("add")}
        className="w-full sm:w-auto"
        size="touch"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Product
      </Button>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matches found" : "No products yet"}
          description={
            searchQuery
              ? "Try a different search term"
              : "Add your first product to start selling to retailers"
          }
          actionLabel={!searchQuery ? "Add Product" : undefined}
          onAction={!searchQuery ? () => setView("add") : undefined}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => {
                setEditingProduct(p);
                setView("edit");
              }}
              onDelete={(p) => setDeletingProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
        isLoading={isLoading}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-3 shadow-xl">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="font-medium text-gray-900">Please wait...</span>
          </div>
        </div>
      )}
    </div>
  );
}
