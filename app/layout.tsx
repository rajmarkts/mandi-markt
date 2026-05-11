import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kirana Mandi - B2B Wholesale Marketplace",
  description: "Connect wholesalers and retailers. Fresh produce, best rates, reliable delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#2f855a" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Kirana Mandi" />
          <link rel="apple-touch-icon" href="/icon-192x192.svg" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Kirana Mandi" />
          <meta name="msapplication-TileColor" content="#1a365d" />
          <meta name="msapplication-TileImage" content="/icon-512x512.svg" />
        </head>
        <body className="min-h-full flex flex-col">
          <ServiceWorker />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
