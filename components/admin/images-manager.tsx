"use client";

import { ImagePlus, LoaderCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { inputClasses } from "@/components/ui/styles";
import { storageUrl } from "@/lib/media";
import { uploadImage } from "@/lib/upload";
import type { ProjectFormValues } from "@/lib/validation/admin";
import { SortableList } from "./sortable-list";
import { useToast } from "./toaster";

type ImageValue = ProjectFormValues["images"][number];
type Props = {
  value: ImageValue[];
  onChange: (value: ImageValue[]) => void;
  folder: string;
  errors?: (string | undefined)[];
};

/** Captures d'un projet : téléversement multiple, texte alternatif, légende, ordre par glisser-déposer. */
export function ImagesManager({ value, onChange, folder, errors = [] }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const toast = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading(list.length);
    const added: ImageValue[] = [];
    for (const file of list) {
      try {
        const { path, width, height } = await uploadImage(file, folder);
        added.push({ path, width, height, alt: "", caption: "" });
      } catch (error) {
        toast(error instanceof Error ? error.message : "Téléversement impossible.", "error");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) {
      onChange([...value, ...added]);
      toast(`${added.length} image(s) ajoutée(s). Décrivez-les puis enregistrez.`);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  const update = (index: number, patch: Partial<ImageValue>) =>
    onChange(value.map((img, i) => (i === index ? { ...img, ...patch } : img)));

  return (
    <div className="grid grid-cols-1 gap-4">
      {value.length > 0 && (
        <SortableList
          items={value}
          getId={(img) => img.path}
          getLabel={(img) => img.alt || img.caption || "image"}
          onReorder={onChange}
          className="grid gap-3"
          itemClassName="rounded-(--radius) border border-line bg-bg"
          renderItem={(img, handle, index) => (
            <div className="flex gap-3 p-3">
              <div className="flex flex-col items-center gap-2">
                {handle}
                <span className="font-mono text-meta text-subtle">{index + 1}</span>
              </div>
              <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-(--radius-sm) bg-sunken sm:w-40">
                {storageUrl("media", img.path) && (
                  <Image src={storageUrl("media", img.path) ?? ""} alt="" fill sizes="160px" className="object-cover" />
                )}
              </div>
              <div className="grid min-w-0 flex-1 gap-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">
                    Texte alternatif <span className="text-muted">(obligatoire)</span>
                  </span>
                  <input
                    value={img.alt}
                    onChange={(e) => update(index, { alt: e.target.value })}
                    placeholder="Ce que montre l'image, pour les personnes aveugles"
                    aria-invalid={Boolean(errors[index])}
                    className={`${inputClasses} py-2`}
                  />
                </label>
                {errors[index] && <p className="text-sm text-danger">{errors[index]}</p>}
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Légende</span>
                  <input
                    value={img.caption}
                    onChange={(e) => update(index, { caption: e.target.value })}
                    className={`${inputClasses} py-2`}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="inline-flex size-11 shrink-0 items-center justify-center self-start rounded-full text-muted hover:bg-sunken hover:text-danger"
                aria-label={`Retirer l'image ${index + 1}`}
              >
                <Trash className="size-4" aria-hidden />
              </button>
            </div>
          )}
        />
      )}

      <label
        htmlFor={inputId}
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-(--radius) border border-dashed border-field bg-bg p-6 text-center text-sm text-muted hover:border-accent hover:text-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
      >
        {uploading > 0 ? (
          <>
            <LoaderCircle className="size-6 animate-spin" aria-hidden />
            <span role="status">Téléversement… ({uploading} restante(s))</span>
          </>
        ) : (
          <>
            <ImagePlus className="size-6" aria-hidden />
            <span>
              <span className="font-medium text-ink">Ajouter des captures</span> — plusieurs fichiers possibles
            </span>
          </>
        )}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          disabled={uploading > 0}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
