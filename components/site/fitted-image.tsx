"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Media } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  image: Media;
  sizes: string;
  eager?: boolean;
  /** Classes du fond flouté (ex. parallaxe au défilement). */
  backdropClassName?: string;
};

/**
 * Image importée affichée en entier, jamais rognée, quel que soit son format :
 * elle est contenue dans le cadre, et les marges éventuelles sont comblées par
 * une copie floutée d'elle-même (même fichier, aucune requête en plus).
 * Pendant le téléchargement, un squelette occupe le cadre ; il s'efface en fondu
 * quand l'image est chargée. L'image reste toujours visible (aucune dépendance au JS).
 * À placer dans un parent `relative overflow-hidden` aux dimensions définies.
 */
export function FittedImage({ image, sizes, eager, backdropClassName }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Skeleton
        className={cn(
          "absolute inset-0 rounded-none transition-opacity duration-500",
          loaded && "pointer-events-none opacity-0",
        )}
      />
      <div aria-hidden className={cn("absolute inset-0", backdropClassName)}>
        <Image
          src={image.url}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="scale-110 object-cover opacity-45 blur-2xl transition-[scale] duration-[1.1s] ease-(--ease-out) group-hover:scale-125"
        />
      </div>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className="object-contain"
      />
    </>
  );
}
