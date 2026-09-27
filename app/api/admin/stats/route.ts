import { fail, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);

  const [availableBooks, soldBooks, activeUsers, blockedUsers, openReports, pendingOrders] =
    await Promise.all([
      db.book.count({ where: { status: "AVAILABLE" } }),
      db.book.count({ where: { status: "SOLD" } }),
      db.user.count({ where: { status: "ACTIVE" } }),
      db.user.count({ where: { status: "BLOCKED" } }),
      db.report.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "PENDING" } }),
    ]);

  return ok({
    stats: {
      totalBooks: availableBooks,
      availableBooks,
      soldBooks,
      totalUsers: activeUsers,
      activeUsers,
      blockedUsers,
      openReports,
      pendingOrders,
      systemStatus: "Connected",
    },
  });
}
