import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const categories = async (): Promise<any> => {
  return prisma.category.findMany({ include: { posts: true } });
};