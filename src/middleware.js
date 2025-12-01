import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/api/:path*"],
};

export default async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Add CORS headers
  const addCors = (res) => {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return addCors(new NextResponse(null, { status: 204 }));
  }

  // Public routes
  const publicRoutes = [
    "/api/admin/login",
    "/api/admin/register",
    "/api/client/login",
    "/api/client/register",
    "/api/freelancer/login",
    "/api/freelancer/register",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return addCors(NextResponse.next());
  }

  // Token check
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return addCors(
      NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("userId", decoded.id);
    reqHeaders.set("role", decoded.role);

    return addCors(
      NextResponse.next({
        request: {
          headers: reqHeaders,
        },
      })
    );
  } catch (error) {
    return addCors(
      NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      )
    );
  }
}
