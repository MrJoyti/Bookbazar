import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const threads = await db.messageThread.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    include: {
      book: true,
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return ok({ threads });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body || !isNonEmptyString(body.bookId) || !isNonEmptyString(body.text)) {
    return fail("bookId and text are required.");
  }

  const book = await db.book.findUnique({ where: { id: body.bookId } });
  if (!book || book.status !== "AVAILABLE") return fail("Book not found.", 404);
  if (book.sellerId === user.id) return fail("You cannot message yourself about your own book.");

  const thread = await db.messageThread.upsert({
    where: {
      bookId_buyerId_sellerId: {
        bookId: book.id,
        buyerId: user.id,
        sellerId: book.sellerId,
      },
    },
    update: {
      messages: {
        create: {
          senderId: user.id,
          text: body.text.trim(),
        },
      },
    },
    create: {
      bookId: book.id,
      buyerId: user.id,
      sellerId: book.sellerId,
      messages: {
        create: {
          senderId: user.id,
          text: body.text.trim(),
        },
      },
    },
    include: { messages: { orderBy: { createdAt: "asc" } }, book: true },
  });

  return ok({ thread }, { status: 201 });
}
