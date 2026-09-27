import { fail, ok } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  if (!user) return fail("Not authenticated.", 401);

  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order) return fail("Order not found.", 404);
  if (order.buyerId !== user.id && order.sellerId !== user.id && user.role !== "ADMIN") {
    return fail("You cannot cancel this order.", 403);
  }
  if (order.status !== "PENDING") return fail("Only pending orders can be cancelled.");

  const updated = await db.$transaction(async (tx) => {
    if (order.paymentMethod === "BALANCE" && user.role !== "ADMIN") {
      await tx.user.update({ where: { id: order.buyerId }, data: { balance: { increment: order.price } } });
    }
    await tx.book.update({ where: { id: order.bookId }, data: { status: "AVAILABLE" } });
    return tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" }, include: { book: true } });
  });

  return ok({ order: updated });
}
