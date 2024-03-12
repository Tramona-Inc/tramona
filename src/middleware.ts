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

    const { pathname, origin } = req.nextUrl;

    if (isAuthPage) {
      if (isAuth) {
        switch (userRole) {
          case "guest":
            return NextResponse.redirect(new URL("/dashboard", req.url));
          case "host":
            // return NextResponse.redirect(new URL("/host", req.url));
            return NextResponse.redirect(new URL("/messages", req.url));
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

      // If not signed in
      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      // async authorized() {
      //   // This is a work-around for handling redirect on auth pages.
      //   // We return true here so that the middleware function above
      //   // is always called.
      //   return true;
      // },
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Check if the middleware is processing the
        // route which requires a specific role
        if (path.startsWith("/admin")) {
          return token?.role === "admin";
        }

        if (path.startsWith("/host")) {
          return token?.role === "host";
        }

        // By default return true only if the token is not null
        // (this forces the users to be signed in to access the page)
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/signin",
    "/auth/signup",
    "/admin/:path*",
    "/host/:path*",
  ],
};
