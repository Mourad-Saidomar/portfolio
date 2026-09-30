"use client";

import { Archive, ArchiveRestore, Mail, MailCheck, MailOpen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMessage, setMessageStatus } from "@/lib/actions/admin/content";
import { formatDateTime } from "@/lib/format";
import type { MessageStatus } from "@/lib/types";
import { useToast } from "./toaster";

type Message = { id: string; name: string; email: string; message: string; status: MessageStatus; created_at: string };

export function MessagesList({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState(initial);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function act(id: string, task: () => Promise<{ ok: boolean; error?: string; message?: string }>, removes = true, success?: string) {
    const previous = messages;
    if (removes) setMessages((all) => all.filter((m) => m.id !== id));
    startTransition(async () => {
      const result = await task();
      if (result.ok) {
        toast(result.message ?? success ?? "Fait.");
        router.refresh();
      } else {
        setMessages(previous);
        toast(result.error ?? "Échec.", "error");
      }
    });
  }

  if (messages.length === 0) {
    return <p className="rounded-(--radius-lg) border border-dashed border-line p-10 text-center text-muted">Aucun message ici.</p>;
  }

  return (
    <ul className="grid gap-4" aria-busy={pending}>
      {messages.map((m) => (
        <li key={m.id}>
          <article className="rounded-(--radius-lg) border border-line bg-surface p-5 sm:p-6" aria-labelledby={`msg-${m.id}`}>
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id={`msg-${m.id}`} className="font-medium">
                {m.name} <span className="font-normal text-muted">— {m.email}</span>
              </h2>
              <time dateTime={m.created_at} className="font-mono text-meta text-subtle">
                {formatDateTime(m.created_at)}
              </time>
            </header>
            <p className="mt-4 whitespace-pre-line">{m.message}</p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re : votre message sur mon portfolio")}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"
              >
                <Mail className="size-4" aria-hidden /> Répondre
              </a>
              {m.status === "new" && (
                <ActionButton icon={<MailCheck className="size-4" aria-hidden />} onClick={() => act(m.id, () => setMessageStatus({ id: m.id, status: "read" }), true, "Marqué comme lu.")}>
                  Marquer comme lu
                </ActionButton>
              )}
              {m.status === "read" && (
                <ActionButton icon={<MailOpen className="size-4" aria-hidden />} onClick={() => act(m.id, () => setMessageStatus({ id: m.id, status: "new" }), true, "Marqué comme non lu.")}>
                  Marquer comme non lu
                </ActionButton>
              )}
              {m.status !== "archived" ? (
                <ActionButton icon={<Archive className="size-4" aria-hidden />} onClick={() => act(m.id, () => setMessageStatus({ id: m.id, status: "archived" }), true, "Message archivé.")}>
                  Archiver
                </ActionButton>
              ) : (
                <ActionButton icon={<ArchiveRestore className="size-4" aria-hidden />} onClick={() => act(m.id, () => setMessageStatus({ id: m.id, status: "read" }), true, "Message désarchivé.")}>
                  Désarchiver
                </ActionButton>
              )}
              <ActionButton
                danger
                icon={<Trash className="size-4" aria-hidden />}
                onClick={() => window.confirm(`Supprimer définitivement le message de ${m.name} ?`) && act(m.id, () => deleteMessage(m.id))}
              >
                Supprimer
              </ActionButton>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

function ActionButton({ children, icon, onClick, danger }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-sunken ${danger ? "hover:text-danger" : "hover:text-ink"}`}
    >
      {icon}
      {children}
    </button>
  );
}
