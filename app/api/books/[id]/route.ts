import { fail, isNonEmptyString, ok, readJson, toPositiveInt } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const bookInclude = {
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
};

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const book = await db.book.findUnique({
    where: { id: params.id },
    include: bookInclude,
  });

  if (!book || book.status !== "AVAILABLE") return fail("Book not found.", 404);
  return ok({ book });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const existing = await db.book.findUnique({ where: { id: params.id } });
  if (!existing) return fail("Book not found.", 404);
  if (existing.sellerId !== user.id && user.role !== "ADMIN") return fail("You cannot edit this book.", 403);
  if (existing.status !== "AVAILABLE") return fail("Only available books can be edited.");

  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const update = {
    title: isNonEmptyString(body.title) ? body.title.trim() : undefined,
    author: isNonEmptyString(body.author) ? body.author.trim() : undefined,
    edition: isNonEmptyString(body.edition) ? body.edition.trim() : undefined,
    price: body.price === undefined ? undefined : toPositiveInt(body.price) ?? undefined,
    condition: isNonEmptyString(body.condition) ? body.condition.trim() : undefined,
    category: isNonEmptyString(body.category) ? body.category.trim() : undefined,
    description: isNonEmptyString(body.description) ? body.description.trim() : undefined,
    isbn: isNonEmptyString(body.isbn) ? body.isbn.trim() : undefined,
    coverColor: isNonEmptyString(body.coverColor) ? body.coverColor : undefined,
    coverImage: isNonEmptyString(body.coverImage) ? body.coverImage : undefined,
  };

  const book = await db.book.update({
    where: { id: params.id },
    data: update,
    include: bookInclude,
  });

  return ok({ book });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const existing = await db.book.findUnique({ where: { id: params.id } });
  if (!existing) return fail("Book not found.", 404);
  if (existing.sellerId !== user.id && user.role !== "ADMIN") return fail("You cannot delete this book.", 403);

  const book = await db.book.update({
    where: { id: params.id },
    data: { status: user.role === "ADMIN" ? "REMOVED" : "REMOVED_BY_SELLER" },
  });

  return ok({ book });
}
