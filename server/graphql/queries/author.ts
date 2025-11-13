import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authors = async (): Promise<any> => {
  return prisma.author.findMany({ include: { posts: true } });
};

export const author = async (_: unknown, args: { id?: string; email?: string }): Promise<any> => {
  if (args?.id) {
    return prisma.author.findUnique({
      where: { id: Number(args.id) },
      include: { posts: true },
    });
  }
  if (args?.email) {
    return prisma.author.findUnique({
      where: { email: args.email },
      include: { posts: true },
    });
  }
  return null;
};
