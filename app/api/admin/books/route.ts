import { fail, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);

  const books = await db.book.findMany({
    include: { seller: { select: { id: true, name: true, email: true, university: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return ok({ books });
}
