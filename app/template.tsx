import PageTransition from "@/components/effects/PageTransition";

/**
 * Next.js calls a fresh instance of `template.tsx` on every navigation, so
 * this is where the page-fold entrance animation lives. Keep this file thin —
 * actual page content belongs in each route's page.tsx.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
