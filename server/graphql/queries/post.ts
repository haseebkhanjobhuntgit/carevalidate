import prisma from "@/prisma/client";

type PostFilter = {
  search?: string;
  published?: boolean;
  authorEmail?: string;
  categorySlugs?: string[];
  tagSlugs?: string[];
};

export const posts = async (
  _: unknown,
  args: { filter?: PostFilter }
): Promise<any> => {
  const f = args.filter;
  const AND: any[] = [];

  if (f?.search?.trim()) {
    AND.push({
      OR: [
        { title:   { contains: f.search, mode: "insensitive" } },
        { content: { contains: f.search, mode: "insensitive" } },
      ],
    });
  }
  if (typeof f?.published === "boolean") AND.push({ published: f.published });
  if (f?.authorEmail) AND.push({ author: { email: f.authorEmail } });
  if (f?.categorySlugs?.length) AND.push({ categories: { some: { slug: { in: f.categorySlugs } } } });
  if (f?.tagSlugs?.length) AND.push({ tags: { some: { slug: { in: f.tagSlugs } } } });

  const where = AND.length ? { AND } : {};

  return prisma.post.findMany({
    where,
    include: { author: true, categories: true, tags: true },
  });
};

export const post = async (_: unknown, args: { slug: string }): Promise<any> => {
  return prisma.post.findUnique({
    where: { slug: args.slug },
    include: { author: true, categories: true, tags: true },
  });
};
