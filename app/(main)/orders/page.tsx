"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function OrdersPage() {
  const { currentUser, orders, ordersLoading, ordersError, refreshOrders, cancelOrder, completeOrder } = useApp();
  const [actionError, setActionError] = useState("");

  // Filter purchases (where user is buyer)
  const purchases = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((o) => o.buyerId === currentUser.id);
  }, [orders, currentUser]);

  // Filter sales (where user is seller)
  const sales = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((o) => o.sellerId === currentUser.id);
  }, [orders, currentUser]);

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Denied</h2>
            <p className="text-ink/80 mb-6">Please sign in to read your transaction records.</p>
            <a href="/login">
              <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In</Button>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-vintage" /> Trade Ledger Registers
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Historical records of your purchases and sales.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 space-y-12">
          {/* Section 1: Purchases */}
          <div>
            <h2 className="font-serif text-xl font-bold text-ink uppercase tracking-tight border-b border-vintage pb-2 mb-4">
              My Purchases
            </h2>
            {ordersLoading ? (
              <p className="font-serif italic text-ink/50 text-xs py-2">
                Loading your purchase ledger from the database.
              </p>
            ) : ordersError ? (
              <div className="border border-dashed border-vintage bg-card p-4 font-serif text-xs text-vintage">
                <p className="font-bold uppercase mb-3">{ordersError}</p>
                <button
                  onClick={() => refreshOrders()}
                  className="border border-vintage bg-vintage text-paper px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-paper hover:text-vintage transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : actionError ? (
              <div className="mb-4 border border-dashed border-vintage bg-beige/30 p-3 font-serif text-[10px] font-bold uppercase text-vintage">
                {actionError}
              </div>
            ) : null}
            {!ordersLoading && !ordersError && purchases.length > 0 ? (
              <div className="border border-vintage bg-card overflow-x-auto">
                <table className="w-full text-left font-serif border-collapse">
                  <thead>
                    <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                      <th className="p-3 font-bold">Order ID</th>
                      <th className="p-3 font-bold">Book Details</th>
                      <th className="p-3 font-bold">Seller</th>
                      <th className="p-3 font-bold">Rate</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {purchases.map((o) => (
                      <tr key={o.id} className="border-b border-vintage/35 hover:bg-beige/10">
                        <td className="p-3 font-bold uppercase text-[10px] text-ink/65">{o.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-ink block uppercase text-xs">{o.bookTitle}</span>
                          <span className="text-[9px] text-ink/50 italic block">{o.date}</span>
                        </td>
                        <td className="p-3 font-bold text-ink/80">{o.sellerName}</td>
                        <td className="p-3 font-bold">৳{o.price}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 border ${
                            o.status === "Completed"
                              ? "border-vintage bg-vintage text-paper"
                              : o.status === "Cancelled"
                              ? "border-vintage bg-beige text-ink/50"
                              : "border-vintage bg-card text-vintage animate-pulse"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {o.status === "Pending" && (
                            <>
                              <button
                                onClick={() => {
                                  setActionError("");
                                  if (confirm("Confirm purchase hand-off has completed successfully?")) {
                                    completeOrder(o.id).then((result) => {
                                      if (!result.success) setActionError(result.error || "Could not complete this order.");
                                    });
                                  }
                                }}
                                className="border border-vintage bg-vintage text-paper px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-paper hover:text-vintage transition-colors"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => {
                                  setActionError("");
                                  if (confirm("Cancel this order? Funds will be credited back.")) {
                                    cancelOrder(o.id).then((result) => {
                                      if (!result.success) setActionError(result.error || "Could not cancel this order.");
                                    });
                                  }
                                }}
                                className="border border-vintage bg-paper text-vintage px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-vintage hover:text-paper transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !ordersLoading && !ordersError ? (
              <p className="font-serif italic text-ink/50 text-xs py-2">
                No record of book purchases found in your logs.
              </p>
            ) : null}
          </div>

          {/* Section 2: Sales */}
          <div>
            <h2 className="font-serif text-xl font-bold text-ink uppercase tracking-tight border-b border-vintage pb-2 mb-4">
              My Sales logs
            </h2>
            {sales.length > 0 ? (
              <div className="border border-vintage bg-card overflow-x-auto">
                <table className="w-full text-left font-serif border-collapse">
                  <thead>
                    <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                      <th className="p-3 font-bold">Order ID</th>
                      <th className="p-3 font-bold">Book Details</th>
                      <th className="p-3 font-bold">Buyer</th>
                      <th className="p-3 font-bold">Rate</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {sales.map((o) => (
                      <tr key={o.id} className="border-b border-vintage/35 hover:bg-beige/10">
                        <td className="p-3 font-bold uppercase text-[10px] text-ink/65">{o.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-ink block uppercase text-xs">{o.bookTitle}</span>
                          <span className="text-[9px] text-ink/50 italic block">{o.date}</span>
                        </td>
                        <td className="p-3 font-bold text-ink/80">{o.buyerName}</td>
                        <td className="p-3 font-bold">৳{o.price}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 border ${
                            o.status === "Completed"
                              ? "border-vintage bg-vintage text-paper"
                              : o.status === "Cancelled"
                              ? "border-vintage bg-beige text-ink/50"
                              : "border-vintage bg-card text-vintage"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {o.status === "Pending" && (
                            <span className="text-[10px] font-bold text-vintage/70 italic uppercase">
                              Awaiting Buyer confirmation...
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="font-serif italic text-ink/50 text-xs py-2">
                No record of book sales found in your logs.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
