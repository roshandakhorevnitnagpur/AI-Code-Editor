import NextAth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

import authConfig from "./auth.config";

const { auth } = NextAth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute)
    if (isLoggedIn) {
      {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
      }
      return null;
    }

    if(isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\W]+$|_next).*)","/","/(api|trpc)(.*)"],
}; 

// This middle is only for the redirecting purpose 