"use client";

import { ImageUp, LoaderCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { storageUrl } from "@/lib/media";
import { uploadImage } from "@/lib/upload";
import { useToast } from "./toaster";

type Props = {
  label: string;
  path: string | null;
  folder: string;
  onChange: (path: string | null) => void;
  aspect?: string;
};

/** Téléversement d'une image unique avec aperçu (couverture, photo de profil). */
export function ImageField({ label, path, folder, onChange, aspect = "aspect-[16/10]" }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const url = storageUrl("media", path);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange(uploaded.path);
      toast("Image téléversée. Pensez à enregistrer.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Téléversement impossible.", "error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
      <div className={`relative ${aspect} w-full max-w-md overflow-hidden rounded-(--radius) border border-dashed border-field bg-sunken`}>
        {url ? (
          <Image src={url} alt="" fill sizes="448px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-sm text-muted">Aucune image</span>
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-bg/70">
            <LoaderCircle className="size-6 animate-spin" aria-hidden />
            <span className="sr-only">Téléversement en cours…</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={id}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink/80 px-4 text-sm hover:bg-ink hover:text-bg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
        >
          <ImageUp className="size-4" aria-hidden />
          {url ? "Remplacer l'image" : "Choisir une image"}
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            aria-describedby={`${id}-label`}
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-sunken hover:text-danger"
          >
            <Trash className="size-4" aria-hidden /> Retirer
          </button>
        )}
      </div>
      <p className="text-sm text-muted">JPEG, PNG, WebP ou AVIF. Optimisée automatiquement (WebP, 2400 px max).</p>
    </div>
  );
}
