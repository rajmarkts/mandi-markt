"use client";

export const dynamic = "force-dynamic";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Store, Package, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"wholesaler" | "retailer" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStored, setUserStored] = useState(false);
  
  const storeUser = useMutation(api.users.storeUser);
  const syncUser = useMutation(api.users.syncClerkUser);
  
  // Get token identifier from user
  const tokenIdentifier = user?.id ? `https://clerk.com|${user.id}` : null;
  
  // Check if user already exists in Convex
  const existingUser = useQuery(
    api.users.getByTokenIdentifier,
    tokenIdentifier ? { tokenIdentifier } : "skip"
  );
  
  // Store user immediately when loaded
  useEffect(() => {
    if (!isLoaded || !user || userStored) return;
    
    const store = async () => {
      try {
        const tokenId = `https://clerk.com|${user.id}`;
        const result = await storeUser({
          tokenIdentifier: tokenId,
          name: user.fullName || user.firstName || "User",
        });
        if (result.success) {
          setUserStored(true);
        }
      } catch (err) {
        console.error("Failed to store user:", err);
        setError("Failed to initialize. Please refresh the page.");
      }
    };
    
    store();
  }, [isLoaded, user, storeUser, userStored]);

  const handleRoleSelect = async (role: "wholesaler" | "retailer") => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, update Clerk metadata
      await user.update({
        unsafeMetadata: {
          role: role,
          onboardingCompleted: true,
        },
      });

      // Then, sync user to Convex database
      await syncUser({
        clerkId: user.id,
        role: role,
        district: "Default", // Will be updated later in profile
        phone: user.phoneNumbers[0]?.phoneNumber || "",
        name: user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      });

      // Redirect based on role
      if (role === "wholesaler") {
        router.push("/dashboard");
      } else {
        router.push("/retailer");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setError("Failed to complete onboarding. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Show friendly loading message while user data is loading or being stored
  const isInitializing = !isLoaded || (user && !userStored && !existingUser);
  
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">🌾</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting up your shop...</h2>
          <p className="text-gray-600">Just a moment while we prepare everything</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-lg">Please sign in to continue</p>
          <button 
            onClick={() => router.push("/sign-in")}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to Kirana Mandi!
          </h1>
          <p className="text-lg text-gray-600">
            Choose your role to get started
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Wholesaler Option */}
          <button
            onClick={() => setSelectedRole("wholesaler")}
            disabled={isSubmitting}
            className={`group relative p-6 rounded-2xl border-2 text-left transition-all ${
              selectedRole === "wholesaler"
                ? "border-navy bg-navy/5 shadow-lg"
                : "border-gray-200 hover:border-navy/50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                selectedRole === "wholesaler" ? "bg-navy text-white" : "bg-navy/10 text-navy"
              }`}>
                <Package className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  I am a Wholesaler
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  I sell products in bulk to retailers
                </p>
              </div>
            </div>
            {selectedRole === "wholesaler" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-navy rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>

          {/* Retailer Option */}
          <button
            onClick={() => setSelectedRole("retailer")}
            disabled={isSubmitting}
            className={`group relative p-6 rounded-2xl border-2 text-left transition-all ${
              selectedRole === "retailer"
                ? "border-emerald bg-emerald/5 shadow-lg"
                : "border-gray-200 hover:border-emerald/50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                selectedRole === "retailer" ? "bg-emerald text-white" : "bg-emerald/10 text-emerald"
              }`}>
                <Store className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  I am a Retailer
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  I buy products for my shop/store
                </p>
              </div>
            </div>
            {selectedRole === "retailer" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-emerald rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald" />
            <span className="font-semibold text-gray-900">What you get:</span>
          </div>
          <ul className="space-y-3 text-base text-gray-600">
            {selectedRole === "wholesaler" ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Manage your product catalog
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Set wholesale prices & bulk rates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Receive orders via WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Track inventory and sales
                </li>
              </>
            ) : selectedRole === "retailer" ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Browse products from multiple wholesalers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Compare prices and find best deals
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Order via WhatsApp instantly
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald">✓</span> Manage Khata (credit) with suppliers
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">→</span> Select a role above to see features
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={() => selectedRole && handleRoleSelect(selectedRole)}
          disabled={!selectedRole || isSubmitting}
          className={`w-full h-16 text-lg font-semibold ${
            selectedRole === "wholesaler" ? "bg-navy hover:bg-navy-dark" : ""
          }`}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Setting up..." : "Continue"}
          {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          You can change your role later in settings
        </p>
      </div>
    </div>
  );
}
