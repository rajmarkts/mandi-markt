import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Kirana Mandi",
  description: "Create your Kirana Mandi account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Kirana Mandi!</h1>
          <p className="text-gray-600 mt-2">Connect with wholesalers & retailers</p>
        </div>

        {/* Clerk Sign Up */}
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-emerald hover:bg-emerald-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors",
              formFieldInput: 
                "border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-emerald focus:ring-2 focus:ring-emerald/20",
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
                "text-emerald font-semibold hover:text-emerald-dark",
            },
          }}
          routing="path"
          path="/sign-up"
          fallbackRedirectUrl="/onboarding"
          signInUrl="/sign-in"
        />

        {/* Custom Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/sign-in" className="text-emerald font-semibold hover:underline">
            Sign in
          </a>
        </p>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure authentication by Clerk</span>
        </div>
      </div>
    </div>
  );
}
