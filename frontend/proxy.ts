import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { STRAPI_BASE_URL } from "./lib/strapi";

const protectedRoutes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  //check if the request is for a protected route
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    //check if the user is authenticated
    const jwt = await getAuthenticatedUser();
    if (!jwt) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });
    const userResponse = await response.json();
    if (!response.ok || !userResponse?.data) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

const getAuthenticatedUser = async () => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("strapi-jwt")?.value;
    return jwt;
  } catch (error) {
    console.error("User authentication check failed", error);
    return null;
  }
};

//Proxy configuration - proxy is only going to be used for protected routes
export const config = {
  matcher: "/dashboard/:path*",
};
