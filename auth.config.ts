import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type {NextAuthConfig} from "next-auth";

export default{
    providers:[
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID as string,
            clientSecret: process.env.AUTH_GITHUB_SECRET as string
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string
        })
    ]
} satisfies NextAuthConfig    