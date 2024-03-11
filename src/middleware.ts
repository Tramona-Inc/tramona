import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/signin") ||
      req.nextUrl.pathname.startsWith("/auth/signup");

    const userRole = token?.role;

    if (isAuthPage) {
      if (isAuth) {
        switch (userRole) {
          case "guest":
            return NextResponse.redirect(new URL("/dashboard", req.url));
          case "host":
            return NextResponse.redirect(new URL("/host", req.url));
          case "admin":
            return NextResponse.redirect(new URL("/admin", req.url));
        }
      }

      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup"],
};
