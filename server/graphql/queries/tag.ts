import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const tags = async (): Promise<any> => {
  return prisma.tag.findMany({ include: { posts: true } });
};