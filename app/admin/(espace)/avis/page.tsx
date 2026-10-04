import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { AdminHeader } from "@/components/admin/ui";
import { EmptyState } from "@/components/site/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { listTestimonials } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Avis" };

export default async function AdminTestimonialsPage() {
  const { supabase } = await requireAdmin();
  const rows = await listTestimonials(supabase);

  return (
    <>
      <AdminHeader
        title="Avis"
        description="Avis d'anciens collègues, affichés dans la section « À propos » de l'accueil. Glissez-déposez pour changer l'ordre."
        actions={
          <ButtonLink href="/admin/avis/nouveau" size="sm" icon={<Plus className="size-4" />} iconPosition="start">
            Nouvel avis
          </ButtonLink>
        }
      />
      <div className="mt-8">
        {rows.length ? (
          <TestimonialsManager
            initial={rows.map((row) => ({
              id: row.id,
              quote: row.quote,
              authorName: row.author_name,
              authorRole: row.author_role,
              published: row.published,
            }))}
          />
        ) : (
          <EmptyState title="Aucun avis">Ajoutez le retour d&apos;un tuteur de stage, d&apos;un formateur ou d&apos;un coéquipier.</EmptyState>
        )}
      </div>
    </>
  );
}
