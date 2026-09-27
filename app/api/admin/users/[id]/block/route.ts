import { fail, ok } from "@/lib/api";
import { publicUserSelect, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);
  if (admin.id === params.id) return fail("You cannot block your own admin account.");

  const target = await db.user.findUnique({ where: { id: params.id }, select: { status: true } });
  if (!target) return fail("User not found.", 404);

  const nextStatus = target.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
  const user = await db.user.update({
    where: { id: params.id },
    data: { status: nextStatus },
    select: publicUserSelect,
  });

  await db.adminActionLog.create({
    data: {
      adminId: admin.id,
      action: nextStatus === "BLOCKED" ? "BLOCK_USER" : "UNBLOCK_USER",
      targetType: "User",
      targetId: user.id,
    },
  });

  return ok({ user });
}
