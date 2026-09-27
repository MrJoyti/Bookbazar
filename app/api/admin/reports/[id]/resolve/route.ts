import { fail, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);

  const report = await db.report.update({
    where: { id: params.id },
    data: { status: "RESOLVED", resolvedAt: new Date() },
    include: { book: true },
  });

  await db.adminActionLog.create({
    data: {
      adminId: admin.id,
      action: "RESOLVE_REPORT",
      targetType: "Report",
      targetId: report.id,
    },
  });

  return ok({ report });
}
