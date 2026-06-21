import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured, skip auth entirely so the rest of the site still loads.
  // The landing page and /api/health remain reachable; protected routes redirect to login.
  if (!url || !anonKey) {
    const path = request.nextUrl.pathname;
    const isProtected =
      path.startsWith("/dashboard") ||
      path.startsWith("/builder") ||
      path.startsWith("/checkout") ||
      path.startsWith("/cover-letters") ||
      path.startsWith("/applications");
    if (isProtected) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/auth/login";
      return NextResponse.redirect(redirect);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session - important for Server Components.
  // Failure here must not crash unrelated routes (e.g. the public landing page).
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/builder') ||
                           request.nextUrl.pathname.startsWith('/checkout') ||
                           request.nextUrl.pathname.startsWith('/cover-letters') ||
                           request.nextUrl.pathname.startsWith('/applications');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    const target = safeRedirectPath(request.nextUrl.pathname + request.nextUrl.search);
    url.searchParams.set("next", target);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
