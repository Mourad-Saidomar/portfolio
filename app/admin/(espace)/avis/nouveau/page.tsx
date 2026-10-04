import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { testimonialToForm } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Nouvel avis" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader eyebrow={<Link href="/admin/avis" className="hover:text-ink">← Avis</Link>} title="Nouvel avis" />
      <div className="mt-8">
        <TestimonialForm initial={testimonialToForm(null)} />
      </div>
    </>
  );
}
