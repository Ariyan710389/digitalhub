import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check admin API access
    if (path.startsWith("/api/admin")) {
      if (!token || (token.role !== "ADMIN" && token.role !== "STAFF")) {
        return NextResponse.json(
          { error: "Unauthorized. Administrator or Staff privilege required." },
          { status: 403 }
        );
      }
    }

    // Check admin role for pages
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (
          path.startsWith("/admin") ||
          path.startsWith("/account") ||
          path.startsWith("/api/admin")
        ) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/admin/:path*"],
};
