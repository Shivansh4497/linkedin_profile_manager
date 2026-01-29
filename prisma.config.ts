// Prisma v7 configuration file
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    migrations: "prisma/migrations",
  },
  datasource: {
    // Transaction pooler for serverless (port 6543)
    url: process.env.DATABASE_URL,
    // Direct connection for migrations (port 5432)
    directUrl: process.env.DIRECT_URL,
  },
});
