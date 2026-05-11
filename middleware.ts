import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
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
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
