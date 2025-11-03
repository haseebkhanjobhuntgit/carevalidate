import prisma from "@/prisma/client";

export const categories = async (): Promise<any> => {
  return prisma.category.findMany({ include: { posts: true } });
};