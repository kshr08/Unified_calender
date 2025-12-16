import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkgPg from "pg";

const { PrismaClient } = pkg;
const { Pool } = pkgPg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
