import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { isRichTextEmpty } from "@/lib/rich-text";
import { richTextExtensions } from "@/lib/tiptap";
import type { RichText as RichTextDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Rendu serveur d'un document Tiptap en éléments React (aucun HTML injecté,
 * aucun JavaScript envoyé au navigateur).
 */
export function RichText({ content, className }: { content: RichTextDoc | null; className?: string }) {
  if (!content || isRichTextEmpty(content)) return null;
  return (
    <div className={cn("prose-case", className)}>
      {renderToReactElement({ content, extensions: richTextExtensions })}
    </div>
  );
}
