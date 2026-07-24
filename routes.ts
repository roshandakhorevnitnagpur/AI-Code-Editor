
//array of routes that are accessible to public
// these routes do not require authentication
export const publicRoutes : string[] = []


//array of routes that are not accessible to public and require authentication
export const protectedRoutes : string[] = [
    "/",
]

// array of routes that are accessible to public  
export const authRoutes : string[] = [
    "/auth/sign-in",
]

export const apiAuthPrefix : string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT : string = "/" // redirect to a home page after login