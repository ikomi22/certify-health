import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const PROTECTED = ["/dashboard", "/facility", "/module", "/select-role"];

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refreshes the session cookie — required by @supabase/ssr
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from login page
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/select-role";
    return NextResponse.redirect(url);
  }

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
