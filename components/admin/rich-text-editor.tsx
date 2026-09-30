"use client";

import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  Bold,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Unlink,
} from "lucide-react";
import { useId } from "react";
import { richTextExtensions } from "@/lib/tiptap";
import type { RichText } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  hint?: string;
  value: RichText | null;
  onChange: (value: RichText | null) => void;
  placeholder?: string;
  error?: string;
};

/** Éditeur de texte riche (Tiptap) : même configuration que le rendu public. */
export function RichTextEditor({ label, hint, value, onChange, placeholder, error }: Props) {
  const id = useId();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [...richTextExtensions, Placeholder.configure({ placeholder: placeholder ?? "Écrivez ici…" })],
    content: value ?? "",
    editorProps: {
      attributes: {
        "aria-labelledby": `${id}-label`,
        ...(hint ? { "aria-describedby": `${id}-hint` } : {}),
        "aria-multiline": "true",
        role: "textbox",
        class: "prose-case min-h-32 max-w-none px-4 py-3 text-base focus:outline-none",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? null : (e.getJSON() as RichText)),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien (https://…)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url === "https://") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:)/.test(url)) {
      window.alert("Le lien doit commencer par https:// ou mailto:");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const tools = editor
    ? [
        { label: "Gras", icon: Bold, active: state?.bold, run: () => editor.chain().focus().toggleBold().run() },
        { label: "Italique", icon: Italic, active: state?.italic, run: () => editor.chain().focus().toggleItalic().run() },
        { label: "Intertitre", icon: Heading3, active: state?.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: "Liste à puces", icon: List, active: state?.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
        { label: "Liste numérotée", icon: ListOrdered, active: state?.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
        { label: "Citation", icon: Quote, active: state?.quote, run: () => editor.chain().focus().toggleBlockquote().run() },
        { label: state?.link ? "Modifier le lien" : "Ajouter un lien", icon: LinkIcon, active: state?.link, run: setLink },
      ]
    : [];

  return (
    <div className="grid gap-2">
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-(--radius) border bg-surface focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30",
          error ? "border-danger" : "border-field",
        )}
      >
        <div role="toolbar" aria-label={`Mise en forme : ${label}`} className="flex flex-wrap gap-0.5 border-b border-line bg-bg/60 p-1">
          {tools.map((tool) => (
            <ToolButton key={tool.label} label={tool.label} pressed={Boolean(tool.active)} onClick={tool.run}>
              <tool.icon className="size-4" aria-hidden />
            </ToolButton>
          ))}
          {editor && state?.link && (
            <ToolButton label="Retirer le lien" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Unlink className="size-4" aria-hidden />
            </ToolButton>
          )}
          <span className="mx-1 w-px self-stretch bg-line" aria-hidden />
          <ToolButton label="Annuler" disabled={!state?.canUndo} onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2 className="size-4" aria-hidden />
          </ToolButton>
          <ToolButton label="Rétablir" disabled={!state?.canRedo} onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2 className="size-4" aria-hidden />
          </ToolButton>
        </div>
        <EditorContent editor={editor} />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-(--radius-sm) text-muted transition-colors hover:bg-sunken hover:text-ink disabled:opacity-40",
        pressed && "bg-ink text-bg hover:bg-ink hover:text-bg",
      )}
    >
      {children}
    </button>
  );
}
