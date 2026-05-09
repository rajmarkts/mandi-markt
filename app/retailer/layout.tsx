import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mandi Markt - Retailer",
  description: "Order fresh produce from local wholesalers",
};

export default function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#f5f5f0]">
      {/* Trust Brand Header */}
      <header className="bg-[#064e3b] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#065f46] rounded-xl flex items-center justify-center border border-[#047857]">
                <span className="text-xl">🌾</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none">Mandi Markt</h1>
                <p className="text-xs text-emerald-200/80">Fresh. Direct. Trusted.</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <span className="text-xs text-emerald-200 bg-[#065f46] px-2 py-1 rounded-lg">Retailer</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24">
        {children}
      </main>
    </div>
  );
}
