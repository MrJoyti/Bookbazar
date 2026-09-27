import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

class OrderCreationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function GET() {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const orders = await db.order.findMany({
    where: { buyerId: user.id },
    include: {
      book: true,
      buyer: { select: { id: true, name: true, email: true, university: true } },
      seller: { select: { id: true, name: true, email: true, university: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok({ orders });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const paymentMethod = body.paymentMethod === "bkash" || body.paymentMethod === "BKASH" ? "BKASH" : "BALANCE";
  const bkashNumber = isNonEmptyString(body.bkashNumber) ? body.bkashNumber.trim() : null;
  if (paymentMethod === "BKASH" && (!bkashNumber || bkashNumber.replace(/\D/g, "").length !== 11)) {
    return fail("Please enter a valid 11-digit bKash number.");
  }

  const cartItems = isNonEmptyString(body.bookId)
    ? []
    : await db.cartItem.findMany({ where: { userId: user.id }, include: { book: true } });
  const books = isNonEmptyString(body.bookId)
    ? await db.book.findMany({ where: { id: body.bookId }, take: 1 })
    : cartItems.map((item) => item.book);

  if (books.length === 0) return fail("No books selected for checkout.");
  const unavailable = books.find((book) => book.status !== "AVAILABLE");
  if (unavailable) return fail(`"${unavailable.title}" is no longer available.`);
  const ownBook = books.find((book) => book.sellerId === user.id);
  if (ownBook) return fail("You cannot purchase your own listed book.");

  const total = books.reduce((sum, book) => sum + book.price, 0);
  if (paymentMethod === "BALANCE" && user.role !== "ADMIN" && user.balance < total) {
    return fail(`Insufficient wallet balance. Total is ${total}, your balance is ${user.balance}.`);
  }

  let orders;
  try {
    orders = await db.$transaction(async (tx) => {
      if (paymentMethod === "BALANCE" && user.role !== "ADMIN") {
        const debit = await tx.user.updateMany({
          where: { id: user.id, balance: { gte: total } },
          data: { balance: { decrement: total } },
        });
        if (debit.count !== 1) {
          throw new OrderCreationError(`Insufficient wallet balance. Total is ${total}, your balance is ${user.balance}.`);
        }
      }

      const created = [];
      for (const book of books) {
        const sold = await tx.book.updateMany({
          where: { id: book.id, status: "AVAILABLE" },
          data: { status: "SOLD" },
        });
        if (sold.count !== 1) {
          throw new OrderCreationError(`"${book.title}" is no longer available.`);
        }

        created.push(
          await tx.order.create({
            data: {
              bookId: book.id,
              buyerId: user.id,
              sellerId: book.sellerId,
              price: book.price,
              paymentMethod,
              bkashNumber,
            },
            include: { book: true },
          })
        );
      }

      const bookIds = books.map((book) => book.id);
      await tx.cartItem.deleteMany({ where: { userId: user.id, bookId: { in: bookIds } } });
      await tx.wishlistItem.deleteMany({ where: { userId: user.id, bookId: { in: bookIds } } });
      await tx.notification.create({
        data: {
          userId: user.id,
          text: `Order placed for ${books.length} book(s), total ${total}.`,
          type: "success",
        },
      });

      return created;
    });
  } catch (error) {
    if (error instanceof OrderCreationError) {
      return fail(error.message, error.status);
    }
    return fail("Could not create order.", 500);
  }

  return ok({ orders, total }, { status: 201 });
}
