import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { threadId: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const thread = await db.messageThread.findUnique({
    where: { id: params.threadId },
    include: {
      book: true,
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) return fail("Thread not found.", 404);
  if (thread.buyerId !== user.id && thread.sellerId !== user.id && user.role !== "ADMIN") {
    return fail("You cannot view this thread.", 403);
  }

  return ok({ thread });
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body || !isNonEmptyString(body.text)) return fail("text is required.");

  const thread = await db.messageThread.findUnique({ where: { id: params.threadId } });
  if (!thread) return fail("Thread not found.", 404);
  if (thread.buyerId !== user.id && thread.sellerId !== user.id) {
    return fail("You cannot reply to this thread.", 403);
  }

  const message = await db.message.create({
    data: {
      threadId: thread.id,
      senderId: user.id,
      text: body.text.trim(),
    },
  });
  await db.messageThread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

  return ok({ message }, { status: 201 });
}
