"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Building2, Wallet, Plus, BookOpen, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function ProfilePage() {
  const { currentUser, login } = useApp();
  const router = useRouter();

  // Profile fields (local modification state)
  const [name, setName] = useState(currentUser?.name || "");
  const [university, setUniversity] = useState(currentUser?.university || "BUET");
  const [depositAmount, setDepositAmount] = useState("500");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertCircle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Denied</h2>
            <p className="text-ink/80 mb-6">Please sign in to access your editorial reader profile.</p>
            <a href="/login">
              <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In</Button>
            </a>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg("Name cannot be empty.");
      return;
    }
    
    // We update localstorage user and context
    const updatedUser = {
      ...currentUser,
      name,
      university,
    };
    localStorage.setItem("bb_user", JSON.stringify(updatedUser));
    // Trigger quick refresh in app state by mock logging in
    login(currentUser.email, currentUser.role);
    setSuccessMsg("Profile details printed successfully.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + amt,
    };
    localStorage.setItem("bb_user", JSON.stringify(updatedUser));
    login(currentUser.email, currentUser.role);
    setSuccessMsg(`Deposited ৳${amt} mock funds to your press wallet.`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight">
              Reader Desk Dashboard
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Welcome back, {currentUser.name}. Manage your credentials, wallets, and classified subscriptions.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {successMsg && (
            <div className="mb-6 border border-vintage bg-card p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
              {successMsg}
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
            {/* Left: Account Overview / Deposit Wallet */}
            <div className="space-y-6">
              {/* Profile card details */}
              <div className="border-2 border-vintage bg-card p-6 shadow-stack space-y-4">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-vintage border-b border-vintage pb-2">
                  Press Pass Audit
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="border border-vintage p-2.5 bg-paper">
                    <UserIcon className="h-8 w-8 text-vintage" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-ink uppercase">{currentUser.name}</h4>
                    <span className="font-serif text-[10px] font-bold uppercase tracking-widest text-ink/50 bg-beige/40 px-1 py-0.5 border border-vintage/30">
                      {currentUser.role} PASS
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 font-serif text-xs">
                  <div className="flex justify-between border-b border-vintage border-dashed py-1">
                    <span className="text-ink/60 uppercase">Email Index:</span>
                    <span className="font-bold">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-vintage border-dashed py-1">
                    <span className="text-ink/60 uppercase">Campus:</span>
                    <span className="font-bold flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> {currentUser.university}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span className="text-vintage uppercase">Wallet Balance:</span>
                    <span className="text-sm flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" /> ৳{currentUser.balance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deposit Mock Wallet */}
              <div className="border border-vintage bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-vintage border-b border-vintage pb-2">
                  Top Up Press Wallet
                </h3>
                <p className="font-serif text-xs text-ink/70 leading-relaxed">
                  Top up your account with mock BDT funds to perform checkout actions across classified circulars.
                </p>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="500"
                    min="10"
                    className="w-full rounded-none border border-vintage bg-paper p-2 font-serif text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  />
                  <button
                    onClick={handleDeposit}
                    className="border border-vintage bg-vintage text-paper px-4 py-2 font-serif text-xs font-bold uppercase hover:bg-paper hover:text-vintage flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Deposit
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Profile edit details */}
            <div className="border-2 border-vintage bg-card p-6 shadow-stack">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-vintage border-b border-vintage pb-2 mb-4">
                Update Reader Credentials
              </h3>

              {errorMsg && (
                <div className="mb-4 border border-dashed border-vintage bg-beige/30 p-2 text-center text-xs font-bold uppercase text-vintage">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 font-serif">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Name stamp
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Your Full Name"
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Campus location
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="mt-1 w-full rounded-none border border-vintage bg-paper p-2.5 text-xs text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-vintage"
                  >
                    <option value="BUET">BUET</option>
                    <option value="NSU">North South University (NSU)</option>
                    <option value="DU">Dhaka University (DU)</option>
                    <option value="IUT">IUT</option>
                    <option value="BRAC U">BRAC University</option>
                  </select>
                </div>

                <div className="border-t border-vintage border-dashed pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="border-2 border-vintage bg-vintage text-paper py-2 px-6 font-bold uppercase hover:bg-paper hover:text-vintage transition-all duration-200"
                  >
                    Commit Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
