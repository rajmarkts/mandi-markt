import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Check if user has completed onboarding (has role metadata)
const hasCompletedOnboarding = (auth: { sessionClaims?: { metadata?: { role?: string } } }) => {
  return auth?.sessionClaims?.metadata?.role === "wholesaler" || 
         auth?.sessionClaims?.metadata?.role === "retailer";
};

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth();
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not logged in, redirect to sign-in
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Check if user needs onboarding (no role set)
  const userRole = sessionClaims?.metadata?.role;
  
  // If no role is set and not already on onboarding page, redirect to onboarding
  if (!userRole && !req.nextUrl.pathname.startsWith("/onboarding")) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Role-based route protection
  if (userRole === "retailer" && req.nextUrl.pathname.startsWith("/dashboard")) {
    // Retailers can't access wholesaler dashboard
    const retailerUrl = new URL("/retailer", req.url);
    return NextResponse.redirect(retailerUrl);
  }

  if (userRole === "wholesaler" && req.nextUrl.pathname.startsWith("/retailer")) {
    // Wholesalers can access retailer view for testing, or redirect to dashboard
    // For now, we'll allow both but the UI will adapt
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
