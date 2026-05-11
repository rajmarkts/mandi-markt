import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Kirana Mandi",
  description: "Sign in to your Kirana Mandi account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to Kirana Mandi</p>
        </div>

        {/* Clerk Sign In */}
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-navy hover:bg-navy-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors",
              formFieldInput: 
                "border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-navy focus:ring-2 focus:ring-navy/20",
              card: 
                "bg-white shadow-xl rounded-2xl border-0",
              headerTitle: 
                "hidden", // We have our own header
              headerSubtitle: 
                "hidden",
              socialButtonsBlockButton: 
                "border-2 border-gray-200 rounded-xl py-3 hover:bg-gray-50",
              dividerLine: 
                "bg-gray-200",
              dividerText: 
                "text-gray-500",
              footerActionLink: 
                "text-navy font-semibold hover:text-navy-dark",
            },
          }}
          routing="path"
          path="/sign-in"
          fallbackRedirectUrl="/onboarding"
          signUpUrl="/sign-up"
        />

        {/* Custom Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-navy font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
