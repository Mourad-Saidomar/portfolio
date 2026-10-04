"use client";

import {
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Layers,
  LogOut,
  MessageSquareQuote,
  Route,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/admin/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/parcours", label: "Parcours", icon: Route },
  { href: "/admin/competences", label: "Compétences", icon: Layers },
  { href: "/admin/avis", label: "Avis", icon: MessageSquareQuote },
  { href: "/admin/profil", label: "Profil & CV", icon: UserRound },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export function AdminNav({ unread, email }: { unread: number; email: string | null }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6 lg:py-6">
        <Link href="/admin" className="font-display text-[1.25rem] leading-none">
          Mourad Saidomar
          <span className="mt-1 block font-mono text-meta text-subtle">Administration</span>
        </Link>
        <form action={logout} className="lg:hidden">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted hover:bg-sunken hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden /> Déconnexion
          </button>
        </form>
      </div>

      <nav aria-label="Administration" className="overflow-x-auto px-3 pb-3 lg:flex-1 lg:overflow-visible lg:px-3">
        <ul className="flex gap-1 lg:flex-col">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-(--radius) px-3 text-sm whitespace-nowrap transition-colors",
                    active ? "bg-ink text-bg" : "text-muted hover:bg-sunken hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                  {href === "/admin/messages" && unread > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 font-mono text-[0.6875rem]",
                        active ? "bg-bg text-ink" : "bg-accent text-on-accent",
                      )}
                    >
                      {unread}
                      <span className="sr-only"> non lu{unread > 1 ? "s" : ""}</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-line p-3 lg:block">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex min-h-11 items-center gap-3 rounded-(--radius) px-3 text-sm text-muted hover:bg-sunken hover:text-ink"
        >
          <ExternalLink className="size-4" aria-hidden /> Voir le site <span className="sr-only">(nouvel onglet)</span>
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-(--radius) px-3 text-sm text-muted hover:bg-sunken hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden /> Se déconnecter
          </button>
        </form>
        {email && <p className="truncate px-3 pt-2 font-mono text-[0.6875rem] text-subtle">{email}</p>}
      </div>
    </aside>
  );
}
