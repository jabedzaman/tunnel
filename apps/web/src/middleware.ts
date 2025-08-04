import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Get the refresh token from the cookies
  const refreshToken = request.cookies.get("refreshToken") || "";

  // Check if the path is in the auth routes
  const inAuth = path === "/sign-in" || path === "/sign-up";
  const inProtected = path.startsWith("/app");

  if (inAuth && refreshToken) {
    // If the user is trying to access the login page but has a refresh token
    // redirect them to the home page
    return NextResponse.redirect(new URL(`/`, request.nextUrl));
  }

  if (inProtected && !refreshToken) {
    // If the user is trying to access a protected page but doesn't have a refresh token
    // redirect them to the login page
    return NextResponse.redirect(
      new URL(`/sign-in?redirect=${path}`, request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
