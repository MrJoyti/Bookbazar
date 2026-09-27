import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body || !isNonEmptyString(body.bookId) || !isNonEmptyString(body.reason)) {
    return fail("bookId and reason are required.");
  }

  const book = await db.book.findUnique({ where: { id: body.bookId } });
  if (!book) return fail("Book not found.", 404);

  const report = await db.report.create({
    data: {
      bookId: book.id,
      reporterId: user.id,
      reason: body.reason.trim(),
    },
    include: { book: true },
  });

  await db.notification.create({
    data: {
      userId: user.id,
      text: `Reported listing "${book.title}" to moderation.`,
      type: "alert",
    },
  });

  return ok({ report }, { status: 201 });
}
