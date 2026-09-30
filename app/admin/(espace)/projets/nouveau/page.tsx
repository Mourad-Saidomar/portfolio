import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { emptyProject } from "@/lib/data/admin-forms";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
  await requireAdmin();
  // Identifiant attribué dès l'ouverture : les images peuvent être téléversées avant le premier enregistrement.
  const id = randomUUID();

  return (
    <>
      <AdminHeader
        eyebrow={<Link href="/admin/projets" className="hover:text-ink">← Projets</Link>}
        title="Nouveau projet"
        description="Renseignez l'essentiel, ajoutez une couverture et l'étude de cas, puis publiez. Vous pouvez enregistrer un brouillon à tout moment."
      />
      <div className="mt-8">
        <ProjectForm initial={emptyProject(id)} status={null} isNew />
      </div>
    </>
  );
}
