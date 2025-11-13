import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../.env") });

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
      coverImageUrl: "https://images.unsplash.com/photo-1762705402471-8f0cf07d694f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1762838896748-12aba8c2a7b8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D",
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
      coverImageUrl: "https://images.unsplash.com/photo-1757156355650-fe8fbad9ff6d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
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
      coverImageUrl: "https://images.unsplash.com/photo-1584298449519-1f6028ed8b97?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
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
      coverImageUrl: "https://images.unsplash.com/photo-1643380922407-e0a504df2e34?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1606547659460-246308e35f59?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI1fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1606547659460-246308e35f59?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI1fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1532423267094-938826c2bc61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1644075001760-76d614feb3e8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1644075001760-76d614feb3e8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1742644349414-11b2dd184284?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM5fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1575295175627-91fbc8339ced?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQyfHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1672023726187-032edab1c417?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ0fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1638003673504-f1c58e323917?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ5fHx8ZW58MHx8fHx8",
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
      coverImageUrl: "https://images.unsplash.com/photo-1658653471356-5a9ca6e807d9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU0fHx8ZW58MHx8fHx8",
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
