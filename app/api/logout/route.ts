import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
  );
  // Delete the cookie server-side so the proxy sees it gone immediately
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
