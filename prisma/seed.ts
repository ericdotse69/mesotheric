import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const demoUser = await prisma.user.upsert({
    where: {
      email: "demo@mesotheric.app",
    },
    update: {},
    create: {
      email: "demo@mesotheric.app",
      name: "Demo User",
    },
  });

  console.log("Demo user ready:", demoUser);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });