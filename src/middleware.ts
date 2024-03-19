import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { userSelectSchema } from "./server/db/schema";
import { getHomePageFromRole } from "./utils/formatters";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/signin") ||
      req.nextUrl.pathname.startsWith("/auth/signup");

    const userRole = userSelectSchema.shape.role.safeParse(token?.role);
    const userPhoneNumber = userSelectSchema.shape.phoneNumber.safeParse(
      token?.phoneNumber,
    );

    // Redirect to role specific page
    if (isAuthPage) {
      if (isAuth && userRole.success) {
        return NextResponse.redirect(
          new URL(getHomePageFromRole(userRole.data), req.url),
        );
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

    const isOnboardingPage =
      req.nextUrl.pathname.startsWith("/auth/onboarding");

    // If the user has already onboarded (phoneNumber is not null) and they are trying to access the onboarding page
    if (
      isOnboardingPage &&
      userPhoneNumber.success &&
      userPhoneNumber.data !== null
    ) {
      if (userRole.success) {
        const role = userRole.data;
        return NextResponse.redirect(
          new URL(getHomePageFromRole(role), req.url),
        );
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If the user has not onboarded (phoneNumber is null) and they are not trying to access the onboarding page

    if (
      !isOnboardingPage &&
      userPhoneNumber.success &&
      userPhoneNumber.data === null
    ) {
      return NextResponse.redirect(new URL("/auth/onboarding", req.url));
    }
  },
  {
    callbacks: {
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
    "/admin/:path*",
    "/host/:path*",
    "/auth/*",
  ],
};
