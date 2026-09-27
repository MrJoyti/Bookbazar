import { fail, ok } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH() {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  return ok({ read: true });
}
