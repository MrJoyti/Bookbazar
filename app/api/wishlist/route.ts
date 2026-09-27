import { Prisma } from "@prisma/client";
import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const wishlist = await db.wishlistItem.findMany({
    where: { userId: user.id, book: { status: "AVAILABLE" } },
    include: {
      book: {
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              university: true,
              role: true,
              status: true,
              balance: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok({ wishlist });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body || !isNonEmptyString(body.bookId)) return fail("bookId is required.");

  const book = await db.book.findUnique({ where: { id: body.bookId } });
  if (!book || book.status !== "AVAILABLE") return fail("Book not found.", 404);
  if (book.sellerId === user.id) return fail("You cannot wishlist your own book.");

  try {
    const item = await db.wishlistItem.create({
      data: { userId: user.id, bookId: book.id },
      include: { book: true },
    });
    return ok({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("This book is already in your wishlist.", 409);
    }
    return fail("Could not add wishlist item.", 500);
  }
}
