import { Prisma } from "@prisma/client";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const university = searchParams.get("university")?.trim();
  const condition = searchParams.get("condition")?.trim();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const mine = searchParams.get("mine") === "true";

  const user = mine ? await requireCurrentUser() : null;
  if (mine && !user) return fail("Not authenticated.", 401);

  const where: Prisma.BookWhereInput = {
    status: "AVAILABLE",
    ...(mine && user ? { sellerId: user.id } : {}),
    ...(category ? { category } : {}),
    ...(university ? { university } : {}),
    ...(condition ? { condition } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
            { isbn: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) || 0 } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) || 0 } : {}),
          },
        }
      : {}),
  };

  let books;
  try {
    books = await db.book.findMany({
      where,
      include: bookInclude,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load books:", error);
    return fail("Book listings are temporarily unavailable.", 503);
  }

  return ok({ books });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const title = isNonEmptyString(body.title) ? body.title.trim() : "";
  const author = isNonEmptyString(body.author) ? body.author.trim() : "";
  const price = toPositiveInt(body.price);
  const condition = isNonEmptyString(body.condition) ? body.condition.trim() : "";
  const category = isNonEmptyString(body.category) ? body.category.trim() : "";
  const description = isNonEmptyString(body.description) ? body.description.trim() : "";

  if (!title || !author || !price || !condition || !category || !description) {
    return fail("Title, author, price, condition, category, and description are required.");
  }

  const book = await db.book.create({
    data: {
      title,
      author,
      price,
      condition,
      category,
      description,
      university: user.university,
      sellerId: user.id,
      edition: isNonEmptyString(body.edition) ? body.edition.trim() : null,
      isbn: isNonEmptyString(body.isbn) ? body.isbn.trim() : null,
      coverColor: isNonEmptyString(body.coverColor) ? body.coverColor : null,
      coverImage: isNonEmptyString(body.coverImage) ? body.coverImage : null,
      rating: toPositiveInt(body.rating),
    },
    include: bookInclude,
  });

  await db.notification.create({
    data: {
      userId: user.id,
      text: `Book "${book.title}" listed successfully.`,
      type: "success",
    },
  });

  return ok({ book }, { status: 201 });
}
