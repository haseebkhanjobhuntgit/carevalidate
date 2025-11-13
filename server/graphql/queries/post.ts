import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PostFilter = {
  search?: string;
  published?: boolean;
  featured?: boolean;
  authorEmail?: string;
  categorySlugs?: string[];
  limit?: number;
  tagSlugs?: string[];
  offset?: number;
};

export const posts = async (
  _: unknown,
  args: { filter?: PostFilter }
): Promise<any> => {
  const f = args.filter;
  const AND: any[] = [];


  if (f?.search?.trim()) {
    const search = f.search.trim();

    AND.push({
      OR: [
        { title:   { contains: search } },
        { content: { contains: search } },
      ],
    });
  }

  if (typeof f?.published === "boolean") AND.push({ published: f.published });
  if(typeof f?.featured == "boolean") AND.push({ featured: f.featured });
  if (f?.authorEmail) AND.push({ author: { email: f.authorEmail } });
  if (f?.categorySlugs?.length) AND.push({ categories: { some: { slug: { in: f.categorySlugs } } } });
  if (f?.tagSlugs?.length) AND.push({ tags: { some: { slug: { in: f.tagSlugs } } } });

  const where = AND.length ? { AND } : {};

  return prisma.post.findMany({
    where,
    take: f?.limit ?? undefined,
    skip: f?.offset ?? undefined,
    include: { author: true, categories: true, tags: true },
  });
};

export const post = async (_: unknown, args: { slug: string }): Promise<any> => {
  return prisma.post.findUnique({
    where: { slug: args.slug },
    include: { author: true, categories: true, tags: true },
  });
};
