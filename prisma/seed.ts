import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../.env") });


const unsplash = (q: string) =>
  `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)}`;

const pravatar = (id: number) => `https://i.pravatar.cc/256?img=${id}`;

async function main() {
  console.log("🌱 Starting seed...");

  const [alice, bob, carol] = await Promise.all([
    prisma.author.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        name: "Alice Johnson",
        bio: "Frontend Developer specializing in Nuxt.js and Vue.js.",
        avatarUrl: pravatar(15),
      },
    }),
    prisma.author.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        name: "Bob Smith",
        bio: "Backend engineer focused on Node.js, GraphQL, and Prisma.",
        avatarUrl: pravatar(22),
      },
    }),
    prisma.author.upsert({
      where: { email: "carol@example.com" },
      update: {},
      create: {
        email: "carol@example.com",
        name: "Carol Nguyen",
        bio: "Full-stack engineer passionate about TypeScript and design systems.",
        avatarUrl: pravatar(33),
      },
    }),
  ]);

  const categoriesData = [
    { name: "Web Dev", slug: "web-dev" },
    { name: "JavaScript", slug: "javascript" },
    { name: "Design", slug: "design" },
    { name: "DevOps", slug: "devops" },
    { name: "Career", slug: "career" },
  ];

  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const tagsData = [
    { name: "Nuxt", slug: "nuxt" },
    { name: "Vue", slug: "vue" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Tailwind", slug: "tailwind" },
    { name: "GraphQL", slug: "graphql" },
    { name: "Design", slug: "design" },
    { name: "Prisma", slug: "prisma" },
    { name: "Database", slug: "database" },
    { name: "React", slug: "react" },
    { name: "CSS", slug: "css" },
    { name: "Serverless", slug: "serverless" },
    { name: "AWS", slug: "aws" },
  ];

  const tags = await Promise.all(
    tagsData.map((t) =>
      prisma.tag.upsert({
        where: { slug: t.slug },
        update: {},
        create: t,
      })
    )
  );

  const tag = Object.fromEntries(tags.map((t) => [t.slug, t]));

  const posts = [
    {
      title: "Getting Started with Nuxt 3 and Apollo Server",
      slug: "getting-started-nuxt3-apollo",
      content:
        "Set up Nuxt 3 with GraphQL (Apollo Server) and Prisma for a complete full-stack blog app.",
      authorId: bob.id,
      published: true,
      featured: true,
      coverImageUrl: unsplash("nuxt 3"),
      categories: ["web-dev", "javascript"],
      tags: ["nuxt", "graphql", "typescript"],
    },
    {
      title: "A Deep Dive into Prisma's Data Modeling",
      slug: "prisma-data-modeling-deep-dive",
      content:
        "Learn how to design complex data models and relationships using Prisma's schema language.",
      authorId: bob.id,
      published: true,
      featured: true,
      coverImageUrl: unsplash("prisma database"),
      categories: ["web-dev", "devops"],
      tags: ["prisma", "database", "typescript"],
    },
    {
      title: "Designing Accessible User Interfaces",
      slug: "designing-accessible-uis",
      content:
        "Practical tips for accessible design systems that comply with WCAG standards.",
      authorId: alice.id,
      published: true,
      featured: true,
      coverImageUrl: unsplash("accessible design"),
      categories: ["design", "web-dev"],
      tags: ["css", "design", "vue"],
    },
    {
      title: "Mastering Tailwind CSS Utility Classes",
      slug: "mastering-tailwind-css",
      content:
        "Use Tailwind CSS utilities to build fast, scalable, and responsive UIs.",
      authorId: alice.id,
      published: true,
      coverImageUrl: unsplash("tailwind css"),
      categories: ["design", "web-dev"],
      tags: ["tailwind", "css", "vue"],
    },
    {
      title: "Understanding TypeScript Generics in Vue 3",
      slug: "typescript-generics-vue3",
      content:
        "Implement TypeScript generics in Vue 3 Composition API for reusable components.",
      authorId: alice.id,
      published: true,
      coverImageUrl: unsplash("typescript vue3"),
      categories: ["javascript", "web-dev"],
      tags: ["vue", "typescript"],
    },
    {
      title: "Building Serverless Functions with Nuxt 3 Nitro",
      slug: "nuxt3-nitro-serverless",
      content:
        "Deploy serverless APIs with Nuxt 3's Nitro engine and scale automatically.",
      authorId: bob.id,
      published: true,
      coverImageUrl: unsplash("serverless"),
      categories: ["devops", "web-dev"],
      tags: ["nuxt", "serverless", "aws"],
    },
    {
      title: "GraphQL vs REST: A Modern Comparison",
      slug: "graphql-vs-rest-comparison",
      content:
        "When to use GraphQL vs REST and what trade-offs matter most for modern teams.",
      authorId: bob.id,
      published: true,
      coverImageUrl: unsplash("graphql api"),
      categories: ["web-dev", "devops"],
      tags: ["graphql", "database"],
    },
    {
      title: "React Developer's Guide to Vue 3",
      slug: "react-guide-to-vue3",
      content:
        "An easy guide for React developers transitioning to Vue 3 and Composition API.",
      authorId: alice.id,
      published: true,
      coverImageUrl: unsplash("react vue3"),
      categories: ["web-dev", "career"],
      tags: ["react", "vue", "typescript"],
    },
    {
      title: "Optimizing SQLite Performance for Local Apps",
      slug: "optimizing-sqlite-performance",
      content:
        "How to optimize SQLite for fast local development environments.",
      authorId: bob.id,
      published: true,
      coverImageUrl: unsplash("sqlite database"),
      categories: ["devops"],
      tags: ["database", "prisma"],
    },
    {
      title: "The Future of Frontend Development in 2025",
      slug: "future-of-frontend-2025",
      content:
        "Predictions on where frontend development is heading in 2025: AI, edge computing, and more.",
      authorId: carol.id,
      published: true,
      coverImageUrl: unsplash("frontend developer"),
      categories: ["career", "web-dev"],
      tags: ["nuxt", "react", "vue"],
    },
    {
      title: "Draft Post: Working with GraphQL Mutations",
      slug: "draft-graphql-mutations",
      content:
        "A draft on implementing GraphQL mutations with Apollo Server and Prisma.",
      authorId: bob.id,
      published: false,
      coverImageUrl: unsplash("graphql mutation"),
      categories: ["web-dev"],
      tags: ["graphql", "prisma"],
    },
    {
      title: "Implementing Dark Mode with Tailwind CSS",
      slug: "implementing-dark-mode-tailwind",
      content:
        "Add dark mode support to your Tailwind project with zero custom CSS.",
      authorId: alice.id,
      published: true,
      coverImageUrl: unsplash("dark mode ui"),
      categories: ["design"],
      tags: ["tailwind", "css"],
    },
    {
      title: "Why TypeScript is Essential for Large Codebases",
      slug: "why-typescript-essential",
      content:
        "Why teams at scale rely on TypeScript for maintainability and reliability.",
      authorId: bob.id,
      published: true,
      coverImageUrl: unsplash("typescript code"),
      categories: ["javascript", "career"],
      tags: ["typescript"],
    },
    {
      title: "A Designer's Guide to the Nuxt 3 Ecosystem",
      slug: "designers-guide-nuxt3",
      content:
        "How designers can use Nuxt 3 tools to work better with developers.",
      authorId: alice.id,
      published: true,
      coverImageUrl: unsplash("nuxt design"),
      categories: ["design", "web-dev"],
      tags: ["nuxt", "vue", "tailwind"],
    },
    {
      title: "Deploying Nuxt Apps with AWS Amplify",
      slug: "deploying-nuxt-aws-amplify",
      content:
        "Use AWS Amplify for continuous deployment and hosting of Nuxt apps.",
      authorId: bob.id,
      published: true,
      coverImageUrl: unsplash("aws amplify nuxt"),
      categories: ["devops"],
      tags: ["aws", "serverless", "nuxt"],
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        content: p.content,
        published: p.published,
        coverImageUrl: p.coverImageUrl,
        author: { connect: { id: p.authorId } },
        categories: {
          connect: p.categories.map((slug) => ({ id: cat[slug].id })),
        },
        tags: {
          connect: p.tags.map((slug) => ({ id: tag[slug].id })),
        },
      },
    });
  }

  console.log(`✅ Seed complete. Inserted ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
