import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesaler Dashboard - Mandi Markt",
  description: "Manage your inventory and products",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-emerald-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold tracking-tight">📦 Mandi Markt</h1>
            </div>
            <nav className="flex items-center gap-2">
              <span className="text-sm opacity-90">Wholesaler</span>
              <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                W
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}
