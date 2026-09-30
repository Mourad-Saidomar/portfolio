import { ArrowRight, CircleAlert, ExternalLink, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { countMessages, findTodos, listMessages, listProjects, listTimeline } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [projects, timeline, counts, latest, todos] = await Promise.all([
    listProjects(supabase),
    listTimeline(supabase),
    countMessages(supabase),
    listMessages(supabase, "new"),
    findTodos(supabase),
  ]);

  const published = projects.filter((p) => p.status === "published").length;
  const stats = [
    { label: "Projets publiés", value: published, detail: `${projects.length - published} brouillon(s)`, href: "/admin/projets" },
    { label: "Étapes du parcours", value: timeline.filter((t) => t.published).length, detail: `${timeline.filter((t) => !t.published).length} masquée(s)`, href: "/admin/parcours" },
    { label: "Messages non lus", value: counts.new, detail: `${counts.read + counts.archived} traité(s)`, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminHeader
        title="Bonjour 👋"
        description="Tout ce que vous publiez ici apparaît immédiatement sur le site, sans redéploiement."
        actions={
          <>
            <ButtonLink href="/admin/projets/nouveau" size="sm" icon={<Plus className="size-4" />} iconPosition="start">
              Nouveau projet
            </ButtonLink>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-sunken hover:text-ink"
            >
              Voir le site <ExternalLink className="size-4" aria-hidden />
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          </>
        }
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="group block rounded-(--radius-lg) border border-line bg-surface p-5 transition-colors hover:border-ink/40"
            >
              <span className="font-mono text-meta text-subtle">{stat.label}</span>
              <span className="mt-3 block font-display text-h2">{stat.value}</span>
              <span className="mt-1 flex items-center justify-between text-sm text-muted">
                {stat.detail}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel
          title="À compléter"
          description="Contenus provisoires marqués « À COMPLÉTER » ou informations manquantes."
        >
          {todos.length === 0 ? (
            <p className="text-muted">Rien à signaler : tout est complet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {todos.map((todo) => (
                <li key={todo.label + todo.href}>
                  <Link href={todo.href} className="flex min-h-11 items-center gap-3 py-2 hover:text-accent">
                    <CircleAlert className="size-4 shrink-0 text-coral" aria-hidden />
                    <span className="flex-1">{todo.label}</span>
                    <ArrowRight className="size-4 text-subtle" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Derniers messages" description={`${counts.new} non lu(s)`}>
          {latest.length === 0 ? (
            <p className="text-muted">Aucun nouveau message.</p>
          ) : (
            <ul className="divide-y divide-line">
              {latest.slice(0, 5).map((m) => (
                <li key={m.id} className="py-3">
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">{m.name}</span>
                    <span className="shrink-0 font-mono text-meta text-subtle">{formatDateTime(m.created_at)}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/messages" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">
            Tous les messages <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Panel>
      </div>
    </>
  );
}
