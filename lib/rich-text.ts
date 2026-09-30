import type { RichText } from "@/lib/types";

/** Petits constructeurs de documents Tiptap (seed, tests). */
export const rt = {
  doc: (...content: RichText[]): RichText => ({ type: "doc", content }),
  p: (text: string): RichText => ({ type: "paragraph", content: [{ type: "text", text }] }),
  ul: (items: string[]): RichText => ({
    type: "bulletList",
    content: items.map((text) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    })),
  }),
};

/** Texte brut d'un document (recherche, métadonnées, détection de contenu vide). */
export function richTextToPlain(node: RichText | null | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  const children = (node.content ?? []).map(richTextToPlain);
  const separator = node.type === "doc" || node.type === "bulletList" || node.type === "orderedList" ? "\n" : "";
  return children.join(separator).trim();
}

export function isRichTextEmpty(node: RichText | null | undefined): boolean {
  return richTextToPlain(node).length === 0;
}
