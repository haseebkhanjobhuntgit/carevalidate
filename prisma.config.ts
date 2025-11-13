import 'dotenv/config';
import { defineConfig } from "prisma/config";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  engine: "classic",
  datasource: {
    url: `file:${dbPath}`
  }
});
