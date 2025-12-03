// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export const config = {
//   matcher: ["/api/:path*"],
// };

// export default async function proxy(req) {
//   const { pathname } = req.nextUrl;

//   // Add CORS headers
//   const addCors = (res) => {
//     res.headers.set("Access-Control-Allow-Origin", "*");
//     res.headers.set("Vary", "Origin");
//     res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     return res;
//   };

//   // Handle preflight
//   if (req.method === "OPTIONS") {
//     return addCors(new NextResponse(null, { status: 204 }));
//   }

//   // Public routes
//   const publicRoutes = [
//     "/api/admin/login",
//     "/api/admin/register",
//     "/api/client/login",
//     "/api/client/register",
//     "/api/freelancer/login",
//     "/api/freelancer/register",
//   ];

//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return addCors(NextResponse.next());
//   }

//   // Token check
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return addCors(
//       NextResponse.json(
//         { message: "No token provided" },
//         { status: 401 }
//       )
//     );
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const reqHeaders = new Headers(req.headers);
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     return addCors(
//       NextResponse.next({
//         request: {
//           headers: reqHeaders,
//         },
//       })
//     );
//   } catch (error) {
//     return addCors(
//       NextResponse.json(
//         { message: "Invalid or expired token" },
//         { status: 401 }
//       )
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// // Configuration to match all API routes
// export const config = {
//   matcher: ["/api/:path*"],
// };

// // Define reusable CORS headers object for consistency
// const CORS_HEADERS = {
//   "Access-Control-Allow-Origin": "*", // Or specify your frontend origin (e.g., "https://yourfrontend.com")
//   "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Vary": "Origin",
// };

// // Helper to add CORS headers to a NextResponse
// const addCorsHeaders = (res) => {
//   Object.entries(CORS_HEADERS).forEach(([key, value]) => {
//     res.headers.set(key, value);
//   });
//   return res;
// };

// export default async function proxy(req) {
//   const { pathname } = req.nextUrl;

//   // Handle preflight OPTIONS request correctly (returns 204 with CORS headers)
//   if (req.method === "OPTIONS") {
//     return addCorsHeaders(new NextResponse(null, { status: 204 }));
//   }

//   // Public routes (Allow access without token)
//   const publicRoutes = [
//     "/api/admin/login",
//     "/api/admin/register",
//     "/api/client/login",
//     "/api/client/register",
//     "/api/freelancer/login",
//     "/api/freelancer/register",
//     "/api/admin/changePassword",
//   ];

//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     // For public routes, just ensure CORS is passed for the OPTIONS request,
//     // and let the request proceed. The API route handlers will handle the actual response CORS.
//     return NextResponse.next();
//   }

//   // Token check for protected routes
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return addCorsHeaders(
//       NextResponse.json(
//         { message: "No token provided" },
//         { status: 401 }
//       )
//     );
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // Ensure you have process.env.JWT_SECRET configured
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const reqHeaders = new Headers(req.headers);
//     // Add decoded user information to headers for downstream access
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     // Continue to the handler with modified request headers
//     return NextResponse.next({
//       request: {
//         headers: reqHeaders,
//       },
//     });
//   } catch (error) {
//     // Token validation failure should return an error with CORS headers
//     return addCorsHeaders(
//       NextResponse.json(
//         { message: "Invalid or expired token" },
//         { status: 401 }
//       )
//     );
//   }
// }



// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export const config = {
//   matcher: ["/api/:path*"],
// };

// const CORS_HEADERS = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Vary": "Origin",
// };

// const addCorsHeaders = (res) => {
//   Object.entries(CORS_HEADERS).forEach(([key, value]) => {
//     res.headers.set(key, value);
//   });
//   return res;
// };

// export default async function proxy(req) {
//   const { pathname } = req.nextUrl;

//   // Handle OPTIONS preflight
//   if (req.method === "OPTIONS") {
//     return addCorsHeaders(new NextResponse(null, { status: 204 }));
//   }

//   // Public API routes (no token required)
//   const publicRoutes = [
//   /^\/api\/admin\/login/,
//   /^\/api\/admin\/register/,
//   /^\/api\/client\/login/,
//   /^\/api\/client\/register/,
//   /^\/api\/freelancer\/login/,
//   /^\/api\/freelancer\/register/,
//   /^\/api\/admin\/changePassword/,
//    /^\/api\/users\/usersdata/,
//     /^\/api\/userslogins\/loglogins/,
//      /^\/api\/projects\/addprojects/,
//       /^\/api\/workingclients\/activeclients/,
//       /^\/api\/admin\/categories/,
// ];

// if (publicRoutes.some((r) => r.test(pathname))) {
//   const res = NextResponse.next();
//   return addCorsHeaders(res);
// }

//   // Protected routes → Check Authorization header
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return addCorsHeaders(
//       NextResponse.json({ message: "No token provided" }, { status: 401 })
//     );
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach user data to headers
//     const reqHeaders = new Headers(req.headers);
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     console.log("Decoded from token: ", decoded);

//     return addCorsHeaders(
//       NextResponse.next({
//         request: { headers: reqHeaders },
//       })
//     );
//   } catch (error) {
//     return addCorsHeaders(
//       NextResponse.json(
//         { message: "Invalid or expired token" },
//         { status: 401 }
//       )
//     );
//   }
// }

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Configure which API routes the middleware applies to
export const config = {
  matcher: ["/api/:path*"],
};

// Allowed frontend origin (replace with your actual frontend URL)
const FRONTEND_ORIGIN = "https://yourfrontend.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Vary": "Origin",
};

// Helper to attach CORS headers
const addCorsHeaders = (res) => {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  return res;
};

// Define public routes that do NOT require authentication
const PUBLIC_ROUTES = [
  /^\/api\/admin\/login/,
  /^\/api\/admin\/register/,
  /^\/api\/client\/login/,
  /^\/api\/client\/register/,
  /^\/api\/freelancer\/login/,
  /^\/api\/freelancer\/register/,
  /^\/api\/admin\/changePassword/,
  /^\/api\/admin\/categories/,
];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    return addCorsHeaders(new NextResponse(null, { status: 204 }));
  }

  // Allow public routes to pass without authentication
  if (PUBLIC_ROUTES.some((r) => r.test(pathname))) {
    return addCorsHeaders(NextResponse.next());
  }

  // Check for Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return addCorsHeaders(
      NextResponse.json({ message: "No token provided" }, { status: 401 })
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Role-based access: Example, admin-only routes
    if (pathname.startsWith("/api/admin") && decoded.role !== "admin") {
      return addCorsHeaders(
        NextResponse.json({ message: "Access denied: Admins only" }, { status: 403 })
      );
    }

    // Attach decoded info to headers for downstream API handlers
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("userId", decoded.id);
    reqHeaders.set("role", decoded.role);

    return addCorsHeaders(
      NextResponse.next({
        request: { headers: reqHeaders },
      })
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return addCorsHeaders(
        NextResponse.json({ message: "Token expired" }, { status: 401 })
      );
    }
    return addCorsHeaders(
      NextResponse.json({ message: "Invalid token" }, { status: 401 })
    );
  }
}
