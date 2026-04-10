import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isPatient = token?.role === "PATIENT";
    const path = req.nextUrl.pathname;

    // Restricted routes for PATIENT
    const restrictedForPatients = [
      "/patients",
      "/doctors",
      "/pharmacy",
      "/laboratory",
      "/blood-bank",
      "/insurance",
      "/billing"
    ];

    if (isPatient && restrictedForPatients.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/patients/:path*",
    "/doctors/:path*",
    "/appointments/:path*",
    "/pharmacy/:path*",
    "/laboratory/:path*",
    "/beds/:path*",
    "/blood-bank/:path*",
    "/insurance/:path*",
    "/billing/:path*",
    "/events/:path*",
    "/about-us/:path*",
    "/settings/:path*",
  ],
};
