import NextAuth from "next-auth";
import { prismaAdapter } from "@auth/prisma-adapter";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
