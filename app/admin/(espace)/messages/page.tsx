import type { Metadata } from "next";
import Link from "next/link";
import { MessagesList } from "@/components/admin/messages-list";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { countMessages, listMessages } from "@/lib/data/admin";
import type { MessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

const TABS: { value: MessageStatus; label: string }[] = [
  { value: "new", label: "Nouveaux" },
  { value: "read", label: "Lus" },
  { value: "archived", label: "Archivés" },
];

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  const { supabase } = await requireAdmin();
  const { statut } = await searchParams;
  const status = TABS.find((t) => t.value === statut)?.value ?? "new";
  const [messages, counts] = await Promise.all([listMessages(supabase, status), countMessages(supabase)]);

  return (
    <>
      <AdminHeader title="Messages" description="Messages reçus via le formulaire de contact du site." />
      <nav aria-label="Filtrer les messages" className="mt-8">
        <ul className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
          {TABS.map((tab) => (
            <li key={tab.value}>
              <Link
                href={tab.value === "new" ? "/admin/messages" : `/admin/messages?statut=${tab.value}`}
                aria-current={status === tab.value ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm",
                  status === tab.value ? "bg-ink text-bg" : "text-muted hover:text-ink",
                )}
              >
                {tab.label}
                <span className="font-mono text-[0.75rem] opacity-80">{counts[tab.value]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6">
        <MessagesList key={status} initial={messages} />
      </div>
    </>
  );
}
