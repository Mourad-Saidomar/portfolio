import { type CSSProperties, Fragment } from "react";

/**
 * Titre dont chaque mot monte depuis un masque au chargement (CSS pur, démarre au premier rendu).
 * Le texte n'est écrit qu'une fois : les mots sont séparés par de vraies espaces, donc lus
 * normalement par les technologies d'assistance et indexés sans doublon.
 */
export function MaskWords({ text, delay = 0, stagger = 60 }: { text: string; delay?: number; stagger?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="mask-line">
        <span style={{ "--d": `${delay + i * stagger}ms` } as CSSProperties}>{word}</span>
      </span>
      {i < words.length - 1 && " "}
    </Fragment>
  ));
}
