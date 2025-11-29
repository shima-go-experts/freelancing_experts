// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Public API routes (no auth required)
//   const publicRoutes = [
//     "/api/admin/login",
//     "/api/client/login",
//     "/api/freelancer/login",
//     "/api/client/register",
//     "/api/freelancer/register",
//   ];

//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ message: "No token provided" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const reqHeaders = new Headers(req.headers);
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     return NextResponse.next({
//       request: { headers: reqHeaders },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Invalid or expired token" },
//       { status: 401 }
//     );
//   }
// }

// export const config = {
//   matcher: ["/api/:path*"], // protect all API routes
// };


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Public API routes (no auth required)
//   const publicRoutes = [
//     "/api/admin/login",
//     "/api/admin/register",
//     "/api/client/login",
//     "/api/client/register",
//     "/api/freelancer/login",
//     "/api/freelancer/register",
//   ];

//   // Allow public routes
//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // Check for authorization header
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ message: "No token provided" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Forward user info in headers
//     const reqHeaders = new Headers(req.headers);
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     return NextResponse.next({
//       request: { headers: reqHeaders },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Invalid or expired token" },
//       { status: 401 }
//     );
//   }
// }

// // Protect all API routes
// export const config = {
//   matcher: ["/api/:path*"],
// };




// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import cors from "cors"

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Public API routes (no auth required)
//   const publicRoutes = [
//     "/api/admin/login",
//     "/api/admin/register",
//     "/api/client/login",
//     "/api/client/register",
//     "/api/freelancer/login",
//     "/api/freelancer/register",
//   ];

//   // Helper function to add CORS headers
//   const addCors = (res) => {
//     res.headers.set("Access-Control-Allow-Origin", "*"); // replace "*" with your frontend in production
//     res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.headers.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     return res;
//   };

//   // Handle preflight OPTIONS requests
//   if (req.method === "OPTIONS") {
//     return addCors(new NextResponse(null, { status: 204 }));
//   }

//   // Allow public routes
//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return addCors(NextResponse.next());
//   }

//   // Check for authorization header
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return addCors(
//       NextResponse.json({ message: "No token provided" }, { status: 401 })
//     );
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Forward user info in headers
//     const reqHeaders = new Headers(req.headers);
//     reqHeaders.set("userId", decoded.id);
//     reqHeaders.set("role", decoded.role);

//     return addCors(
//       NextResponse.next({
//         request: { headers: reqHeaders },
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

// // Protect all API routes
// export const config = {
//   matcher: ["/api/:path*"],
// };
    

// ``



import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const allowedOrigins = [
    "http://localhost:3000",
    "https://freelancer-website-fi8x.vercel.app",
  ];

  const origin = req.headers.get("origin");

  const addCors = (res) => {
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  };

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return addCors(new NextResponse(null, { status: 204 }));
  }

  // PUBLIC ROUTES
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

  // TOKEN CHECK
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
        request: { headers: reqHeaders },
      })
    );
  } catch (err) {
    return addCors(
      NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      )
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
