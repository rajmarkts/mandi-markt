import Link from "next/link";
import { Store, Package, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-emerald-900 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold">Mandi Markt</span>
          </div>
          <p className="text-emerald-200 text-sm hidden sm:block">
            Fresh Wholesale Produce
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Fresh Produce,{' '}
            <span className="text-emerald-700">Wholesale Prices</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Order vegetables, fruits, grains and more directly from trusted wholesalers. 
            Best rates, reliable delivery.
          </p>
        </div>

        {/* Entry Points */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Retailer Entry */}
          <Link
            href="/retailer"
            className="group bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-8 hover:border-emerald-500 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
              <Store className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              I&apos;m a Retailer
            </h2>
            <p className="text-gray-600 mb-6">
              Browse products, place orders, and manage your account. 
              Best prices for shop owners.
            </p>
            <div className="flex items-center text-emerald-700 font-semibold">
              Start Ordering
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          {/* Wholesaler Entry */}
          <Link
            href="/dashboard"
            className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 hover:border-emerald-500 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
              <Package className="w-8 h-8 text-gray-600 group-hover:text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              I&apos;m a Wholesaler
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your inventory, set prices, and track orders. 
              Grow your business online.
            </p>
            <div className="flex items-center text-emerald-700 font-semibold">
              Manage Inventory
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">
              Compare rates and get the best deals from verified wholesalers
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Trusted Quality</h3>
            <p className="text-gray-600 text-sm">
              All wholesalers are verified for quality and reliability
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Ordering</h3>
            <p className="text-gray-600 text-sm">
              Simple WhatsApp-based order placement with instant confirmation
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-200 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2024 Mandi Markt. Connecting wholesalers and retailers.
          </p>
        </div>
      </footer>
    </div>
  );
}
