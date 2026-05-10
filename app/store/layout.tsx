import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirana Mandi - Order Fresh",
  description: "Order fresh produce directly from wholesalers",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#f5f5f0]">
      {/* Trust Brand Header - Deep Forest Green */}
      <header className="bg-[#064e3b] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 bg-[#065f46] rounded-xl flex items-center justify-center border border-[#047857]">
                <span className="text-xl">🌾</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none">Kirana Mandi</h1>
                <p className="text-xs text-emerald-200/80">Fresh. Direct. Trusted.</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <span className="text-xs text-emerald-200 bg-[#065f46] px-2 py-1 rounded-lg">Retailer</span>
              <div className="w-9 h-9 bg-[#065f46] rounded-full flex items-center justify-center border border-[#047857]">
                <span className="text-sm font-bold">R</span>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Connection Status Bar - for low-internet indication */}
      <div className="bg-[#022c22] text-white/80 text-xs py-1.5 px-4 text-center">
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          Connected • Orders work offline
        </span>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-32">
        {children}
      </main>
    </div>
  );
}
