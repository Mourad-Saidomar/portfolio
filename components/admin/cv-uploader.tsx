"use client";

import { FileText, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { replaceCv } from "@/lib/actions/admin/content";
import { uploadCv } from "@/lib/upload";
import { useToast } from "./toaster";

export function CvUploader({ currentUrl, updatedAt }: { currentUrl: string | null; updatedAt: string | null }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const path = await uploadCv(file);
      const result = await replaceCv({ path });
      if (!result.ok) throw new Error(result.error);
      toast(result.message ?? "CV remplacé.");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Téléversement impossible.", "error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sunken text-accent">
          <FileText className="size-5" aria-hidden />
        </span>
        {currentUrl ? (
          <p className="min-w-0 text-sm">
            <a href={currentUrl} target="_blank" rel="noopener" className="font-medium underline underline-offset-2">
              CV actuel (PDF)<span className="sr-only"> — nouvel onglet</span>
            </a>
            {updatedAt && (
              <span className="block text-muted">
                Mis à jour le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(updatedAt))}
              </span>
            )}
            <span className="block text-muted">Lien public permanent : /cv</span>
          </p>
        ) : (
          <p className="text-sm text-muted">Aucun CV en ligne : le bouton de téléchargement est masqué sur le site.</p>
        )}
      </div>
      <label
        htmlFor={id}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent hover:bg-accent-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
      >
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
        {busy ? "Envoi…" : currentUrl ? "Remplacer le CV" : "Téléverser le CV"}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={busy}
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}
