import { fail, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail("Admin access required.", 403);

  const book = await db.book.update({
    where: { id: params.id },
    data: { status: "REMOVED" },
  });

  await db.adminActionLog.create({
    data: {
      adminId: admin.id,
      action: "REMOVE_BOOK",
      targetType: "Book",
      targetId: book.id,
      note: book.title,
    },
  });

  return ok({ book });
}
