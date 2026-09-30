import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col justify-between py-10">
      <Link href="/" className="font-display text-[1.375rem]">
        Mourad Saidomar
      </Link>
      <div className="py-20">
        <p className="font-mono text-meta text-coral">Erreur 404</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-h1">Cette page n&apos;existe pas (ou plus).</h1>
        <p className="mt-6 max-w-[48ch] text-lead text-muted">
          Le lien est peut-être ancien, ou le projet a été retiré. Les pages principales sont toujours là :
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" icon={<ArrowLeft className="size-4" />} iconPosition="start">
            Accueil
          </ButtonLink>
          <ButtonLink href="/projets" variant="secondary">
            Projets
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact
          </ButtonLink>
        </div>
      </div>
      <p className="font-mono text-meta text-subtle">mourad-saidomar — portfolio</p>
    </main>
  );
}
