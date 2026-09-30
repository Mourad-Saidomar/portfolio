import StarterKit from "@tiptap/starter-kit";

/**
 * Configuration Tiptap partagée par l'éditeur (admin) et le rendu statique (site public),
 * pour garantir que tout ce qui s'écrit s'affiche à l'identique.
 * Les titres internes commencent au niveau 3 : chaque section d'étude de cas porte déjà un h2.
 */
export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [3, 4] },
    codeBlock: false,
    horizontalRule: false,
    underline: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto"],
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
];
