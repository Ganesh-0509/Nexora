import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/v1/opportunities(.*)",
  "/api/webhooks/(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // ── Rate limiting on API routes ────────────────────────
  if (isApiRoute(req)) {
    const { rateLimit } = await import("@/server/middleware/rate-limiter");
    const limited = await rateLimit(req);
    if (limited) return limited;
  }

  // ── Auth protection ────────────────────────────────────
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  // ── Security headers (always applied) ─────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/).*)",
  ],
};
