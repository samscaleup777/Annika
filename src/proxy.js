import { NextResponse } from "next/server";

const CANONICAL_HOST = "annika-hk777.vercel.app";

export function proxy(request) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  // Keep OAuth state, cookies, and callbacks on one stable host.
  // Vercel generates multiple aliases and deployment URLs for this project;
  // starting auth on one host and returning to another can break the state cookie.
  if (
    hostname !== CANONICAL_HOST &&
    hostname.startsWith("annika-") &&
    hostname.endsWith(".vercel.app")
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
