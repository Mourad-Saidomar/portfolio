import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Toaster } from "@/components/admin/toaster";
import { requireAdmin } from "@/lib/auth";
import { countMessages } from "@/lib/data/admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const counts = await countMessages(session.supabase);

  return (
    <Toaster>
      <div className="lg:flex">
        <AdminNav unread={counts.new} email={session.email} />
        <main id="contenu" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </Toaster>
  );
}

function AdminSkeleton() {
  return (
    <div className="lg:flex" aria-busy="true">
      <div className="h-28 border-b border-line bg-surface lg:h-dvh lg:w-64 lg:border-r lg:border-b-0" />
      <div className="flex-1 px-5 py-12 lg:px-12">
        <span className="sr-only">Chargement…</span>
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-12 w-64 rounded-(--radius) bg-sunken" />
          <div className="h-64 rounded-(--radius-lg) bg-sunken" />
        </div>
      </div>
    </div>
  );
}
