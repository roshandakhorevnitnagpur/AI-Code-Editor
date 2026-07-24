import { PrismaClient } from "./prisma-client/index.js";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient({} as never);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
