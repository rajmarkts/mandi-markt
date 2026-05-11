import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding",
  "/api/webhook(.*)",
  "/api/webhooks(.*)",
  "/api/convex(.*)",
  "/api/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const userRole = metadata?.role;

  // Redirect users WITH role away from onboarding
  if (userRole && req.nextUrl.pathname.startsWith("/onboarding")) {
    const redirectUrl = userRole === "retailer" 
      ? new URL("/retailer", req.url) 
      : new URL("/dashboard", req.url);
    return new Response(null, { status: 307, headers: { Location: redirectUrl.toString() } });
  }

  // Redirect users WITHOUT role to onboarding
  if (!userRole && !req.nextUrl.pathname.startsWith("/onboarding")) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return new Response(null, { status: 307, headers: { Location: onboardingUrl.toString() } });
  }

  if (userRole === "retailer" && req.nextUrl.pathname.startsWith("/dashboard")) {
    const retailerUrl = new URL("/retailer", req.url);
    return new Response(null, { status: 307, headers: { Location: retailerUrl.toString() } });
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};