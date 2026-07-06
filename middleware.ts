import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
    authRoutes,
} from "@/routes"

import authconfig from "./auth.config"

const {auth} = NextAuth(authconfig)

export default auth((req)=>{
    const {nextUrl} = req
    const isLoggedIn = !!req.auth // 
    // !! handles the null , if the req.auth is null , it will strictly return false
    // instead of returning a null

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    // hitting to a internal api route
    if(isApiAuthRoute){
        return null;
    }

    // hitting to a authenticate route
    if(isAuthRoute){
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
        }
        return null;
    }

    // if user is not loggedIn and it is not a public route then it will redirect to sign-in route/page
    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/sign-in",nextUrl))
    }

    return null;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
}