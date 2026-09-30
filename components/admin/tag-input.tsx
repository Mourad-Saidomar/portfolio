"use client";

import { X } from "lucide-react";
import { useId, useState } from "react";
import { inputClasses } from "@/components/ui/styles";

type Props = {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  max?: number;
};

/** Saisie de tags : Entrée ou virgule pour ajouter, bouton × (ou Retour arrière) pour retirer. */
export function TagInput({ label, hint, value, onChange, placeholder, error, max = 20 }: Props) {
  const id = useId();
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const items = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const next = [...value];
    for (const item of items) {
      if (next.length >= max) break;
      if (!next.some((v) => v.toLowerCase() === item.toLowerCase())) next.push(item);
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`${label} : ${value.length} élément(s)`}>
          {value.map((tag) => (
            <li key={tag} className="inline-flex items-center gap-1 rounded-full border border-line bg-bg py-0.5 pr-1 pl-3 text-sm">
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== tag))}
                className="inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-danger"
                aria-label={`Retirer ${tag}`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (draft.trim()) add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={placeholder}
        aria-describedby={hint ? `${id}-hint` : undefined}
        aria-invalid={Boolean(error)}
        className={inputClasses}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
