"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, BookOpen, Users, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

type AdminStats = {
  totalBooks: number | null;
  totalReports: number | null;
  totalUsers: number | null;
  systemStatus: string;
};

async function readApiError(response: Response) {
  try {
    const result = await response.json();
    return typeof result?.error === "string" ? result.error : "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export default function AdminPage() {
  const { currentUser } = useApp();
  const [stats, setStats] = useState<AdminStats>({
    totalBooks: null,
    totalReports: null,
    totalUsers: null,
    systemStatus: "",
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (currentUser?.role !== "admin") return;

    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError("");
      try {
        const response = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(await readApiError(response));
        }
        const result = await response.json();
        const apiStats = result?.data?.stats || {};
        setStats({
          totalBooks: apiStats.totalBooks,
          totalReports: apiStats.openReports,
          totalUsers: apiStats.activeUsers ?? apiStats.totalUsers,
          systemStatus: apiStats.systemStatus || "",
        });
      } catch (error) {
        setStats({
          totalBooks: null,
          totalReports: null,
          totalUsers: null,
          systemStatus: "",
        });
        setStatsError(error instanceof Error ? error.message : "Could not load dashboard statistics.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [currentUser?.role]);

  const formatStat = (value: number | null) => (statsLoading || value === null ? "..." : value);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="min-h-screen bg-paper flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="mx-auto max-w-md px-5 py-24 text-center font-serif">
            <ShieldAlert className="h-12 w-12 mx-auto text-vintage mb-3 animate-pulse" />
            <h2 className="text-2xl font-extrabold uppercase text-vintage mb-2">Editor Access Restricted</h2>
            <p className="text-sm text-ink/80 mb-6">
              Only verified members of the BookBazar Editorial Board can audit system files.
            </p>
            <a href="/login?redirect=/admin">
              <Button variant="primary" className="border-2 border-vintage font-bold uppercase">Sign In as Admin</Button>
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
              <ShieldAlert className="h-7 w-7 text-vintage" /> Editorial Board Control Desk
            </h1>
            <p className="font-serif text-sm italic text-ink/75 mt-1">
              Audit campus circular publications, moderate disputes, and oversee reader registers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 space-y-8">
          {statsError && (
            <div className="border border-vintage bg-card p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
              {statsError}
            </div>
          )}

          {/* Admin Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-4 font-serif">
            <div className="border border-vintage bg-card p-4 text-center">
              <span className="text-[10px] text-ink/50 uppercase block font-bold">Classified Ads</span>
              <strong className="text-2xl block text-vintage mt-1">{formatStat(stats.totalBooks)}</strong>
            </div>
            <div className="border border-vintage bg-card p-4 text-center">
              <span className="text-[10px] text-ink/50 uppercase block font-bold">Open Reports</span>
              <strong className="text-2xl block text-vintage mt-1">{formatStat(stats.totalReports)}</strong>
            </div>
            <div className="border border-vintage bg-card p-4 text-center">
              <span className="text-[10px] text-ink/50 uppercase block font-bold">Active Members</span>
              <strong className="text-2xl block text-vintage mt-1">{formatStat(stats.totalUsers)}</strong>
            </div>
            <div className="border border-vintage bg-card p-4 text-center">
              <span className="text-[10px] text-ink/50 uppercase block font-bold">System Status</span>
              <strong className="text-sm uppercase block text-vintage font-bold mt-2.5 flex items-center justify-center gap-1">
                <ShieldCheck className="h-4 w-4" /> {statsLoading ? "..." : stats.systemStatus || "Unavailable"}
              </strong>
            </div>
          </div>

          {/* Sub-ledgers list */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Reported Circulars",
                desc: "Review ads reported by students for pricing or integrity violations.",
                href: "/admin/reports",
                icon: AlertTriangle,
                count: stats.totalReports ?? undefined,
              },
              {
                title: "Moderate Books",
                desc: "Delete or edit academic classifieds violating standard guidelines.",
                href: "/admin/books",
                icon: BookOpen,
                count: stats.totalBooks ?? undefined,
              },
              {
                title: "Audit Members",
                desc: "Block, warn, or audit student registry credentials.",
                href: "/admin/users",
                icon: Users,
                count: stats.totalUsers ?? undefined,
              },
              {
                title: "Moderation Log Ledger",
                desc: "View historical moderation actions.",
                href: "/admin/moderation",
                icon: ShieldCheck,
              },
            ].map((col) => (
              <div key={col.title} className="border-2 border-vintage bg-card p-5 shadow-stack flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-vintage pb-2">
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-ink flex items-center gap-1.5">
                      <col.icon className="h-4 w-4" /> {col.title}
                    </h3>
                    {col.count !== undefined && (
                      <span className="font-serif text-[10px] font-bold uppercase text-vintage bg-beige px-2 py-0.5 border border-vintage/30">
                        {col.count} Items
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-xs text-ink/75 leading-relaxed mt-2.5">{col.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-vintage border-dashed flex justify-end">
                  <a href={col.href}>
                    <Button variant="secondary" className="border border-vintage text-[10px] font-bold uppercase py-1.5 px-4 flex items-center gap-1 hover:bg-beige">
                      Open Ledger <ArrowRight className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
