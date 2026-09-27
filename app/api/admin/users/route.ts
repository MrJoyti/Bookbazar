import { fail, ok } from "@/lib/api";
import { publicUserSelect, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);

  const users = await db.user.findMany({
    select: {
      ...publicUserSelect,
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok({ users });
}
