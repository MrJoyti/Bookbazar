"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, ArrowLeft, Ban, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/lib/context/AppContext";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  university: string;
  status: string;
  _count?: {
    listings?: number;
  };
};

async function readApiError(response: Response) {
  try {
    const result = await response.json();
    return typeof result?.error === "string" ? result.error : "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export default function AdminUsersPage() {
  const { currentUser, toggleBlockUser } = useApp();
  const [successMsg, setSuccessMsg] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      setUsers(result?.data?.users || []);
    } catch (error) {
      setUsers([]);
      setErrorMsg(error instanceof Error ? error.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser?.role]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <AlertTriangle className="h-10 w-10 mx-auto text-vintage mb-3" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Access Restricted</h2>
            <p className="text-ink/80">Only Editorial Board can audit student database.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleToggleBlock = async (user: AdminUser) => {
    setUpdatingUserId(user.id);
    setErrorMsg("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}/block`, { method: "PATCH" });
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      const updatedUser = result?.data?.user as AdminUser | undefined;
      const newStatus = updatedUser?.status === "BLOCKED" ? "Blocked" : "Active";

      await fetchUsers();
      toggleBlockUser(user.email);
      setSuccessMsg(`User status updated for ${user.email} to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Could not update user status.");
    } finally {
      setUpdatingUserId("");
    }
  };

  return (
    <main className="min-h-screen bg-paper flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Section Header */}
        <section className="border-b border-vintage py-8 bg-beige/25">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <a
              href="/admin"
              className="mb-3 inline-flex items-center gap-1 font-serif text-[10px] font-bold uppercase tracking-wider text-ink/75 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> Return to board
            </a>
            <h1 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight flex items-center gap-2">
              <Users className="h-7 w-7 text-vintage" /> Reader Registry Ledger
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {successMsg && (
            <div className="mb-6 border border-vintage bg-card p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 border border-vintage bg-card p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
              {errorMsg}
            </div>
          )}

          <div className="border border-vintage bg-card overflow-x-auto">
            <table className="w-full text-left font-serif border-collapse">
              <thead>
                <tr className="border-b border-vintage bg-beige/35 uppercase text-[10px] tracking-wider text-vintage">
                  <th className="p-3 font-bold">Member Name</th>
                  <th className="p-3 font-bold">Email</th>
                  <th className="p-3 font-bold">Campus</th>
                  <th className="p-3 font-bold">Listed Ads</th>
                  <th className="p-3 font-bold">Audit Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {loading ? (
                  <tr className="border-b border-vintage/35">
                    <td className="p-3 font-bold uppercase text-ink/60" colSpan={6}>Loading reader registry...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr className="border-b border-vintage/35">
                    <td className="p-3 font-bold uppercase text-ink/60" colSpan={6}>No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isActive = u.status !== "BLOCKED";

                    return (
                      <tr key={u.id} className="border-b border-vintage/35 hover:bg-beige/10">
                        <td className="p-3 font-bold uppercase text-ink">{u.name}</td>
                        <td className="p-3 text-ink/75">{u.email}</td>
                        <td className="p-3 font-bold text-ink/80">{u.university}</td>
                        <td className="p-3 font-bold">{u._count?.listings ?? 0}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-0.5 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 border ${
                            isActive ? "border-vintage bg-vintage text-paper" : "border-vintage bg-beige text-ink/50"
                          }`}>
                            {isActive ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            disabled={updatingUserId === u.id}
                            className="border border-vintage bg-paper p-1.5 text-vintage hover:bg-vintage hover:text-paper shadow-sm"
                            title={isActive ? "Block Reader" : "Unblock Reader"}
                          >
                            {isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
