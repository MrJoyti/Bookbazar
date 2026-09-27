import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "BookBazar Admin";
const university = process.env.ADMIN_UNIVERSITY?.trim() || "System HQ";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
  process.exit(1);
}

if (password.length < 6) {
  console.error("ADMIN_PASSWORD must be at least 6 characters.");
  process.exit(1);
}

function hashPassword(rawPassword) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(rawPassword, salt, 100_000, 32, "sha256").toString("base64url");
  return `pbkdf2_sha256$100000$${salt}$${hash}`;
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      university,
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(password),
      balance: 99999,
    },
    create: {
      name,
      email,
      university,
      role: "ADMIN",
      status: "ACTIVE",
      passwordHash: hashPassword(password),
      balance: 99999,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log(`Admin ready: ${user.email} (${user.role}, ${user.status})`);
} finally {
  await prisma.$disconnect();
}
