import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed if the token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/seat-booking"],
};