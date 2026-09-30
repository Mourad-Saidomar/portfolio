"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "success" | "error";
type Toast = { id: number; message: string; tone: Tone };
type Notify = (message: string, tone?: Tone) => void;

const ToastContext = createContext<Notify>(() => {});

/** Notifications de l'admin, annoncées aux lecteurs d'écran (succès : polite, erreur : assertive). */
export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const notify = useCallback<Notify>(
    (message, tone = "success") => {
      const id = Date.now() + Math.random();
      setToasts((all) => [...all.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), tone === "error" ? 8000 : 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => notify, [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4">
        <div aria-live="polite" className="contents">
          {toasts.filter((t) => t.tone === "success").map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>
        <div aria-live="assertive" className="contents">
          {toasts.filter((t) => t.tone === "error").map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = toast.tone === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-(--radius) border bg-surface px-4 py-3 shadow-lift",
        toast.tone === "success" ? "border-line" : "border-danger/50",
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", toast.tone === "success" ? "text-success" : "text-danger")} aria-hidden />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button type="button" onClick={onClose} className="-m-1 rounded p-1 text-muted hover:text-ink" aria-label="Fermer la notification">
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function useToast(): Notify {
  return useContext(ToastContext);
}
