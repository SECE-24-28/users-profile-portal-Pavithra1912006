import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/students"];
const authRoutes = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  if (isAuthRoute && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
