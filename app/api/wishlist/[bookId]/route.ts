import { fail, ok } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: { bookId: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  await db.wishlistItem.deleteMany({
    where: { userId: user.id, bookId: params.bookId },
  });

  return ok({ removed: true });
}
