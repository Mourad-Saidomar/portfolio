import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getTestimonial } from "@/lib/data/admin";
import { testimonialToForm } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Modifier l'avis" };

export default async function EditTestimonialPage({ params }: PageProps<"/admin/avis/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const row = await getTestimonial(supabase, id);
  if (!row) notFound();

  return (
    <>
      <AdminHeader eyebrow={<Link href="/admin/avis" className="hover:text-ink">← Avis</Link>} title={`Avis de ${row.author_name}`} />
      <div className="mt-8">
        <TestimonialForm key={row.updated_at} initial={testimonialToForm(row)} />
      </div>
    </>
  );
}
